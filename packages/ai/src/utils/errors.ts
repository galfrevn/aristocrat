import type { AIError, AIProvider } from '@/types';

export class AIProviderError extends Error implements AIError {
	errorCode: string;
	provider: AIProvider;
	modelName: string;
	isRetryable: boolean;

	constructor(
		errorMessage: string,
		errorCode: string,
		aiProvider: AIProvider,
		modelName: string,
		isRetryable = false,
	) {
		super(errorMessage);
		this.name = 'AIProviderError';
		this.errorCode = errorCode;
		this.provider = aiProvider;
		this.modelName = modelName;
		this.isRetryable = isRetryable;
	}
}

export function createAIError(
	unknownError: unknown,
	aiProvider: AIProvider,
	modelName: string,
): AIError {
	if (unknownError instanceof Error) {
		const errorWithCode = unknownError as Error & {
			status?: number;
			code?: string;
		};

		const isRateLimitError =
			errorWithCode.status === 429 ||
			errorWithCode.code === 'rate_limit_exceeded' ||
			unknownError.message.includes('rate limit') ||
			unknownError.message.includes('quota') ||
			unknownError.message.includes('429');

		const isServerError =
			(errorWithCode.status && errorWithCode.status >= 500) ||
			unknownError.message.includes('500') ||
			unknownError.message.includes('502') ||
			unknownError.message.includes('503') ||
			unknownError.message.includes('504');

		const errorCode = isRateLimitError
			? 'RATE_LIMIT'
			: isServerError
				? 'SERVER_ERROR'
				: 'UNKNOWN_ERROR';

		return new AIProviderError(
			unknownError.message,
			errorCode,
			aiProvider,
			modelName,
			isRateLimitError || isServerError,
		);
	}

	return new AIProviderError(
		'Unknown error occurred',
		'UNKNOWN_ERROR',
		aiProvider,
		modelName,
		false,
	);
}

export function isRetryableError(aiError: AIError): boolean {
	return aiError.isRetryable;
}

export async function withRetry<T>(
	retryableFunction: () => Promise<T>,
	maximumRetries = 3,
	retryDelay = 1000,
): Promise<T> {
	let lastError: Error | null = null;

	for (
		let attemptNumber = 1;
		attemptNumber <= maximumRetries;
		attemptNumber++
	) {
		try {
			return await retryableFunction();
		} catch (caughtError) {
			lastError = caughtError as Error;

			if (caughtError instanceof AIProviderError && !caughtError.isRetryable) {
				throw caughtError;
			}

			if (attemptNumber === maximumRetries) {
				break;
			}

			await new Promise((resolve) =>
				setTimeout(resolve, retryDelay * attemptNumber),
			);
		}
	}

	throw lastError || new Error('Unknown error occurred during retry attempts');
}

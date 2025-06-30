/**
 * Retry utilities for handling transient failures
 */

export interface RetryOptions {
	maxRetries: number;
	baseDelay: number;
	maxDelay: number;
	backoffMultiplier: number;
	retryCondition?: (error: Error) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
	maxRetries: 3,
	baseDelay: 1000,
	maxDelay: 10000,
	backoffMultiplier: 2,
	retryCondition: (error: Error) => {
		// Default: retry on network errors and server errors
		const message = error.message.toLowerCase();
		return (
			message.includes('network') ||
			message.includes('timeout') ||
			message.includes('connection') ||
			message.includes('econnreset') ||
			message.includes('enotfound') ||
			message.includes('temporary failure')
		);
	},
};

/**
 * Sleep for the specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(attempt: number, options: RetryOptions): number {
	const delay = Math.min(
		options.baseDelay * options.backoffMultiplier ** attempt,
		options.maxDelay,
	);
	// Add jitter to prevent thundering herd
	return delay + Math.random() * 0.1 * delay;
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	options: Partial<RetryOptions> = {},
): Promise<T> {
	const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			// Don't retry if this is the last attempt
			if (attempt === config.maxRetries) {
				break;
			}

			// Check if we should retry this error
			if (config.retryCondition && !config.retryCondition(lastError)) {
				break;
			}

			const delay = calculateDelay(attempt, config);
			console.warn(
				`Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms:`,
				lastError.message,
			);

			await sleep(delay);
		}
	}

	throw lastError || new Error('Retry operation failed without error');
}

/**
 * Specific retry configuration for yt-dlp operations
 */
export const YT_DLP_RETRY_OPTIONS: Partial<RetryOptions> = {
	maxRetries: 3,
	baseDelay: 2000,
	maxDelay: 15000,
	backoffMultiplier: 2,
	retryCondition: (error: Error) => {
		const message = error.message.toLowerCase();
		return (
			message.includes('network') ||
			message.includes('timeout') ||
			message.includes('connection') ||
			message.includes('temporary failure') ||
			message.includes('server error') ||
			message.includes('503') ||
			message.includes('502') ||
			message.includes('504')
		);
	},
};

import type { AIProvider } from '@/types';
import {
	AIProviderError,
	createAIError,
	isRetryableError,
} from '@/utils/errors';

describe('AIProviderError', () => {
	test('should create error with correct properties', () => {
		const error = new AIProviderError(
			'Test error message',
			'TEST_ERROR',
			'openai' as AIProvider,
			'gpt-4',
			true,
		);

		expect(error.message).toBe('Test error message');
		expect(error.errorCode).toBe('TEST_ERROR');
		expect(error.provider).toBe('openai');
		expect(error.modelName).toBe('gpt-4');
		expect(error.isRetryable).toBe(true);
		expect(error.name).toBe('AIProviderError');
	});
});

describe('createAIError', () => {
	test('should detect rate limit error from status code', () => {
		const mockError = new Error('Rate limit exceeded') as Error & {
			status: number;
		};
		mockError.status = 429;

		const aiError = createAIError(mockError, 'openai', 'gpt-4');

		expect(aiError.errorCode).toBe('RATE_LIMIT');
		expect(aiError.isRetryable).toBe(true);
	});

	test('should detect rate limit error from error code', () => {
		const mockError = new Error('Rate limit exceeded') as Error & {
			code: string;
		};
		mockError.code = 'rate_limit_exceeded';

		const aiError = createAIError(mockError, 'openai', 'gpt-4');

		expect(aiError.errorCode).toBe('RATE_LIMIT');
		expect(aiError.isRetryable).toBe(true);
	});

	test('should detect server error from status code', () => {
		const mockError = new Error('Internal server error') as Error & {
			status: number;
		};
		mockError.status = 500;

		const aiError = createAIError(mockError, 'anthropic', 'claude-3');

		expect(aiError.errorCode).toBe('SERVER_ERROR');
		expect(aiError.isRetryable).toBe(true);
	});

	test('should fallback to string matching for rate limit', () => {
		const mockError = new Error('API rate limit exceeded');

		const aiError = createAIError(mockError, 'openai', 'gpt-4');

		expect(aiError.errorCode).toBe('RATE_LIMIT');
		expect(aiError.isRetryable).toBe(true);
	});

	test('should create unknown error for unrecognized errors', () => {
		const mockError = new Error('Some unknown error');

		const aiError = createAIError(mockError, 'perplexity', 'llama-3');

		expect(aiError.errorCode).toBe('UNKNOWN_ERROR');
		expect(aiError.isRetryable).toBe(false);
	});

	test('should handle non-Error objects', () => {
		const aiError = createAIError('String error', 'openai', 'gpt-4');

		expect(aiError.message).toBe('Unknown error occurred');
		expect(aiError.errorCode).toBe('UNKNOWN_ERROR');
		expect(aiError.isRetryable).toBe(false);
	});
});

describe('isRetryableError', () => {
	test('should return true for retryable errors', () => {
		const error = new AIProviderError(
			'Rate limit error',
			'RATE_LIMIT',
			'openai',
			'gpt-4',
			true,
		);

		expect(isRetryableError(error)).toBe(true);
	});

	test('should return false for non-retryable errors', () => {
		const error = new AIProviderError(
			'Invalid API key',
			'AUTH_ERROR',
			'openai',
			'gpt-4',
			false,
		);

		expect(isRetryableError(error)).toBe(false);
	});
});

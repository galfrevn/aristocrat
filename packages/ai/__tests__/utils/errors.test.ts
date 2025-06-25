import type { AIProvider } from '@/types';
import {
	AIProviderError,
	createAIError,
	isRetryableError,
	withRetry,
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

describe('withRetry', () => {
	test('should return result on first success', async () => {
		const mockFunction = jest.fn().mockResolvedValue('success');

		const result = await withRetry(mockFunction);

		expect(result).toBe('success');
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});

	test('should retry on retryable errors and eventually succeed', async () => {
		const mockFunction = jest
			.fn()
			.mockRejectedValueOnce(
				new AIProviderError(
					'Rate limit',
					'RATE_LIMIT',
					'openai',
					'gpt-4',
					true,
				),
			)
			.mockResolvedValue('success');

		const result = await withRetry(mockFunction, 3, 10);

		expect(result).toBe('success');
		expect(mockFunction).toHaveBeenCalledTimes(2);
	});

	test('should not retry on non-retryable AIProviderError', async () => {
		const nonRetryableError = new AIProviderError(
			'Invalid API key',
			'INVALID_KEY',
			'openai',
			'gpt-4',
			false,
		);
		const mockFunction = jest.fn().mockRejectedValue(nonRetryableError);

		await expect(withRetry(mockFunction)).rejects.toBe(nonRetryableError);
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});

	test('should retry up to maximum attempts and throw last error', async () => {
		const retryableError = new AIProviderError(
			'Server error',
			'SERVER_ERROR',
			'openai',
			'gpt-4',
			true,
		);
		const mockFunction = jest.fn().mockRejectedValue(retryableError);

		await expect(withRetry(mockFunction, 2, 10)).rejects.toBe(retryableError);
		expect(mockFunction).toHaveBeenCalledTimes(2);
	});

	test('should retry on non-AIProviderError exceptions', async () => {
		const genericError = new Error('Network error');
		const mockFunction = jest
			.fn()
			.mockRejectedValueOnce(genericError)
			.mockResolvedValue('success');

		const result = await withRetry(mockFunction, 3, 10);

		expect(result).toBe('success');
		expect(mockFunction).toHaveBeenCalledTimes(2);
	});

	test('should throw last error when all retries exhausted', async () => {
		const lastError = new Error('Final error');
		const mockFunction = jest.fn().mockRejectedValue(lastError);

		await expect(withRetry(mockFunction, 1, 10)).rejects.toBe(lastError);
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});

	test('should handle edge case with no error thrown', async () => {
		let callCount = 0;
		const mockFunction = jest.fn().mockImplementation(() => {
			callCount++;
			if (callCount <= 2) {
				const error = new Error('Test error');
				delete (error as any).message; // Make it falsy
				throw error;
			}
			throw null; // This will trigger the fallback error
		});

		await expect(withRetry(mockFunction, 3, 10)).rejects.toThrow(
			'Unknown error occurred during retry attempts',
		);
	});

	test('should apply retry delay with exponential backoff', async () => {
		const retryableError = new AIProviderError(
			'Rate limit',
			'RATE_LIMIT',
			'openai',
			'gpt-4',
			true,
		);
		const mockFunction = jest.fn().mockRejectedValue(retryableError);

		const start = Date.now();
		await expect(withRetry(mockFunction, 3, 50)).rejects.toBe(retryableError);
		const elapsed = Date.now() - start;

		// Should have delays of 50ms * 1 + 50ms * 2 = 150ms minimum
		expect(elapsed).toBeGreaterThanOrEqual(100);
		expect(mockFunction).toHaveBeenCalledTimes(3);
	});

	test('should work with custom retry parameters', async () => {
		const mockFunction = jest.fn().mockResolvedValue('custom success');

		const result = await withRetry(mockFunction, 5, 100);

		expect(result).toBe('custom success');
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});

	test('should handle maximum retries reached with no last error', async () => {
		let attemptCount = 0;
		const mockFunction = jest.fn().mockImplementation(() => {
			attemptCount++;
			if (attemptCount <= 2) {
				throw null; // Throw falsy value
			}
			return 'should not reach here';
		});

		await expect(withRetry(mockFunction, 2, 10)).rejects.toThrow(
			'Unknown error occurred during retry attempts',
		);
		expect(mockFunction).toHaveBeenCalledTimes(2);
	});
});

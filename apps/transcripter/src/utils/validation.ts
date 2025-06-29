/**
 * YouTube video ID validation utilities
 */

/**
 * YouTube video ID regex pattern
 * Matches YouTube video IDs which are exactly 11 characters
 * containing alphanumeric characters, hyphens, and underscores
 */
const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Error thrown when a video ID is invalid
 */
export class InvalidVideoIdError extends Error {
	constructor(videoId: string) {
		super(
			`Invalid YouTube video ID: ${videoId}. Video IDs must be exactly 11 characters containing only letters, numbers, hyphens, and underscores.`,
		);
		this.name = 'InvalidVideoIdError';
	}
}

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
		throw new InvalidVideoIdError(String(videoId));
	}

	// Remove any whitespace
	const sanitized = videoId.trim();

	// Validate the sanitized ID
	if (!isValidYouTubeVideoId(sanitized)) {
		throw new InvalidVideoIdError(sanitized);
	}

	return sanitized;
}

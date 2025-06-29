/**
 * Custom error classes for transcription service
 */

/**
 * Base class for all transcription-related errors
 */
export abstract class TranscriptionError extends Error {
	abstract readonly statusCode: number;
	abstract readonly userMessage: string;
	abstract readonly errorCode: string;

	constructor(
		message: string,
		public readonly context?: Record<string, unknown>,
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

/**
 * Error thrown when a video is not found or unavailable
 */
export class VideoNotFoundError extends TranscriptionError {
	readonly statusCode = 404;
	readonly errorCode = 'VIDEO_NOT_FOUND';
	readonly userMessage: string;

	constructor(videoId: string, context?: Record<string, unknown>) {
		super(`Video not found: ${videoId}`, context);
		this.userMessage = `El video con ID ${videoId} no fue encontrado o no está disponible.`;
	}
}

/**
 * Error thrown when transcription is not available for the video
 */
export class TranscriptNotAvailableError extends TranscriptionError {
	readonly statusCode = 404;
	readonly errorCode = 'TRANSCRIPT_NOT_AVAILABLE';
	readonly userMessage: string;

	constructor(
		videoId: string,
		language: string,
		context?: Record<string, unknown>,
	) {
		super(
			`No transcript available for video ${videoId} in language ${language}`,
			context,
		);
		this.userMessage = `No hay transcripción en ${language} disponible para el video ${videoId}.`;
	}
}

/**
 * Error thrown when the requested language is not supported
 */
export class UnsupportedLanguageError extends TranscriptionError {
	readonly statusCode = 400;
	readonly errorCode = 'UNSUPPORTED_LANGUAGE';
	readonly userMessage: string;

	constructor(
		language: string,
		supportedLanguages: string[],
		context?: Record<string, unknown>,
	) {
		super(
			`Unsupported language: ${language}. Supported languages: ${supportedLanguages.join(', ')}`,
			context,
		);
		this.userMessage = `El idioma ${language} no está soportado. Idiomas disponibles: ${supportedLanguages.join(', ')}.`;
	}
}

/**
 * Error thrown when video ID format is invalid
 */
export class InvalidVideoIdError extends TranscriptionError {
	readonly statusCode = 400;
	readonly errorCode = 'INVALID_VIDEO_ID';
	readonly userMessage: string;

	constructor(videoId: string, context?: Record<string, unknown>) {
		super(`Invalid YouTube video ID: ${videoId}`, context);
		this.userMessage = `El ID del video ${videoId} no es válido. Debe ser un ID de YouTube de 11 caracteres.`;
	}
}

/**
 * Error thrown when rate limited by external services
 */
export class RateLimitError extends TranscriptionError {
	readonly statusCode = 429;
	readonly errorCode = 'RATE_LIMITED';
	readonly userMessage: string;

	constructor(retryAfter?: number, context?: Record<string, unknown>) {
		super('Rate limited by external service', context);
		const waitTime = retryAfter
			? ` Intente nuevamente en ${retryAfter} segundos.`
			: ' Intente nuevamente más tarde.';
		this.userMessage = `Demasiadas solicitudes.${waitTime}`;
	}
}

/**
 * Error thrown when the service is temporarily unavailable
 */
export class ServiceUnavailableError extends TranscriptionError {
	readonly statusCode = 503;
	readonly errorCode = 'SERVICE_UNAVAILABLE';
	readonly userMessage: string;

	constructor(serviceName: string, context?: Record<string, unknown>) {
		super(`Service unavailable: ${serviceName}`, context);
		this.userMessage = `El servicio de ${serviceName} no está disponible temporalmente. Intente nuevamente más tarde.`;
	}
}

/**
 * Error thrown when yt-dlp process fails
 */
export class YtDlpError extends TranscriptionError {
	readonly statusCode = 500;
	readonly errorCode = 'YTDLP_ERROR';
	readonly userMessage: string;

	constructor(
		exitCode: number,
		stderr: string,
		context?: Record<string, unknown>,
	) {
		super(`yt-dlp failed with exit code ${exitCode}: ${stderr}`, context);
		this.userMessage =
			'Error al procesar el video. Verifique que el enlace sea válido y que el video tenga subtítulos disponibles.';
	}
}

/**
 * Error thrown when file operations fail
 */
export class FileOperationError extends TranscriptionError {
	readonly statusCode = 500;
	readonly errorCode = 'FILE_OPERATION_ERROR';
	readonly userMessage: string;

	constructor(
		operation: string,
		filePath: string,
		originalError: Error,
		context?: Record<string, unknown>,
	) {
		super(
			`File operation '${operation}' failed for ${filePath}: ${originalError.message}`,
			context,
		);
		this.userMessage =
			'Error interno del servidor al procesar los archivos de transcripción.';
	}
}

/**
 * Error thrown when parsing subtitle files fails
 */
export class SubtitleParsingError extends TranscriptionError {
	readonly statusCode = 500;
	readonly errorCode = 'SUBTITLE_PARSING_ERROR';
	readonly userMessage: string;

	constructor(
		fileName: string,
		originalError: Error,
		context?: Record<string, unknown>,
	) {
		super(
			`Failed to parse subtitle file ${fileName}: ${originalError.message}`,
			context,
		);
		this.userMessage =
			'Error al procesar el archivo de subtítulos. El formato puede estar corrupto.';
	}
}

/**
 * Check if an error is a TranscriptionError
 */
export function isTranscriptionError(
	error: unknown,
): error is TranscriptionError {
	return error instanceof TranscriptionError;
}

/**
 * Supported languages for transcription
 */
export const SUPPORTED_LANGUAGES = ['es', 'en', 'es-419', 'es-ES'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Validate if a language is supported
 */
export function isSupportedLanguage(
	language: string,
): language is SupportedLanguage {
	return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}

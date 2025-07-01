/**
 * Comprehensive error logging utility
 */

export interface LogContext {
	videoId?: string;
	userId?: string;
	language?: string;
	operation?: string;
	timestamp?: string;
	duration?: number;
	[key: string]: unknown;
}

export enum LogLevel {
	ERROR = 'ERROR',
	WARN = 'WARN',
	INFO = 'INFO',
	DEBUG = 'DEBUG',
}

/**
 * Logger class for structured logging
 */
export class Logger {
	private static instance: Logger;

	private constructor() {}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	private formatLog(
		level: LogLevel,
		message: string,
		context?: LogContext,
	): string {
		const timestamp = new Date().toISOString();
		const logEntry = {
			timestamp,
			level,
			message,
			...context,
		};
		return JSON.stringify(logEntry);
	}

	error(message: string, error?: Error, context?: LogContext): void {
		const errorContext = {
			...context,
			errorName: error?.name,
			errorMessage: error?.message,
			errorStack: error?.stack,
		};
		console.error(this.formatLog(LogLevel.ERROR, message, errorContext));
	}

	warn(message: string, context?: LogContext): void {
		console.warn(this.formatLog(LogLevel.WARN, message, context));
	}

	info(message: string, context?: LogContext): void {
		console.info(this.formatLog(LogLevel.INFO, message, context));
	}

	debug(message: string, context?: LogContext): void {
		if (process.env.NODE_ENV === 'development') {
			console.debug(this.formatLog(LogLevel.DEBUG, message, context));
		}
	}
}

/**
 * Default logger instance
 */
export const logger = Logger.getInstance();

/**
 * Log transcription operation start
 */
export function logTranscriptionStart(
	videoId: string,
	language: string,
	userId?: string,
): void {
	logger.info('Transcription started', {
		videoId,
		language,
		userId,
		operation: 'transcription_start',
	});
}

/**
 * Log transcription operation success
 */
export function logTranscriptionSuccess(
	videoId: string,
	language: string,
	segmentCount: number,
	duration: number,
	userId?: string,
): void {
	logger.info('Transcription completed successfully', {
		videoId,
		language,
		userId,
		segmentCount,
		duration,
		operation: 'transcription_success',
	});
}

/**
 * Log transcription operation failure
 */
export function logTranscriptionError(
	error: Error,
	videoId?: string,
	language?: string,
	userId?: string,
	duration?: number,
): void {
	logger.error('Transcription failed', error, {
		videoId,
		language,
		userId,
		duration,
		operation: 'transcription_error',
	});
}

/**
 * Log retry attempt
 */
export function logRetryAttempt(
	operation: string,
	attempt: number,
	maxRetries: number,
	error: Error,
	context?: LogContext,
): void {
	logger.warn(`Retry attempt ${attempt}/${maxRetries} for ${operation}`, {
		...context,
		operation,
		attempt,
		maxRetries,
		retryReason: error.message,
	});
}

/**
 * Log external service error
 */
export function logExternalServiceError(
	service: string,
	error: Error,
	context?: LogContext,
): void {
	logger.error(`External service error: ${service}`, error, {
		...context,
		service,
		operation: 'external_service_error',
	});
}

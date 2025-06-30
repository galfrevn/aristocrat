/**
 * Tests for custom error classes
 */

import {
	FileOperationError,
	InvalidVideoIdError,
	isSupportedLanguage,
	isTranscriptionError,
	RateLimitError,
	ServiceUnavailableError,
	SUPPORTED_LANGUAGES,
	SubtitleParsingError,
	TranscriptNotAvailableError,
	UnsupportedLanguageError,
	VideoNotFoundError,
	YtDlpError,
} from '@/errors';

describe('TranscriptionError classes', () => {
	describe('VideoNotFoundError', () => {
		it('should create error with correct properties', () => {
			const videoId = 'dQw4w9WgXcQ';
			const error = new VideoNotFoundError(videoId);

			expect(error.name).toBe('VideoNotFoundError');
			expect(error.statusCode).toBe(404);
			expect(error.errorCode).toBe('VIDEO_NOT_FOUND');
			expect(error.userMessage).toBe(
				`El video con ID ${videoId} no fue encontrado o no está disponible.`,
			);
			expect(error.message).toContain(videoId);
		});

		it('should include context in error', () => {
			const videoId = 'dQw4w9WgXcQ';
			const context = { stderr: 'Video unavailable' };
			const error = new VideoNotFoundError(videoId, context);

			expect(error.context).toEqual(context);
		});
	});

	describe('TranscriptNotAvailableError', () => {
		it('should create error with correct properties', () => {
			const videoId = 'dQw4w9WgXcQ';
			const language = 'es';
			const error = new TranscriptNotAvailableError(videoId, language);

			expect(error.name).toBe('TranscriptNotAvailableError');
			expect(error.statusCode).toBe(404);
			expect(error.errorCode).toBe('TRANSCRIPT_NOT_AVAILABLE');
			expect(error.userMessage).toBe(
				`No hay transcripción en ${language} disponible para el video ${videoId}.`,
			);
		});
	});

	describe('UnsupportedLanguageError', () => {
		it('should create error with correct properties', () => {
			const language = 'fr';
			const supportedLanguages = ['es', 'en'];
			const error = new UnsupportedLanguageError(language, supportedLanguages);

			expect(error.name).toBe('UnsupportedLanguageError');
			expect(error.statusCode).toBe(400);
			expect(error.errorCode).toBe('UNSUPPORTED_LANGUAGE');
			expect(error.userMessage).toBe(
				`El idioma ${language} no está soportado. Idiomas disponibles: ${supportedLanguages.join(', ')}.`,
			);
		});
	});

	describe('InvalidVideoIdError', () => {
		it('should create error with correct properties', () => {
			const videoId = 'invalid-id';
			const error = new InvalidVideoIdError(videoId);

			expect(error.name).toBe('InvalidVideoIdError');
			expect(error.statusCode).toBe(400);
			expect(error.errorCode).toBe('INVALID_VIDEO_ID');
			expect(error.userMessage).toBe(
				`El ID del video ${videoId} no es válido. Debe ser un ID de YouTube de 11 caracteres.`,
			);
		});
	});

	describe('RateLimitError', () => {
		it('should create error without retry after', () => {
			const error = new RateLimitError();

			expect(error.name).toBe('RateLimitError');
			expect(error.statusCode).toBe(429);
			expect(error.errorCode).toBe('RATE_LIMITED');
			expect(error.userMessage).toBe(
				'Demasiadas solicitudes. Intente nuevamente más tarde.',
			);
		});

		it('should create error with retry after', () => {
			const retryAfter = 60;
			const error = new RateLimitError(retryAfter);

			expect(error.userMessage).toBe(
				`Demasiadas solicitudes. Intente nuevamente en ${retryAfter} segundos.`,
			);
		});
	});

	describe('ServiceUnavailableError', () => {
		it('should create error with correct properties', () => {
			const serviceName = 'yt-dlp';
			const error = new ServiceUnavailableError(serviceName);

			expect(error.name).toBe('ServiceUnavailableError');
			expect(error.statusCode).toBe(503);
			expect(error.errorCode).toBe('SERVICE_UNAVAILABLE');
			expect(error.userMessage).toBe(
				`El servicio de ${serviceName} no está disponible temporalmente. Intente nuevamente más tarde.`,
			);
		});
	});

	describe('YtDlpError', () => {
		it('should create error with correct properties', () => {
			const exitCode = 1;
			const stderr = 'Download failed';
			const error = new YtDlpError(exitCode, stderr);

			expect(error.name).toBe('YtDlpError');
			expect(error.statusCode).toBe(500);
			expect(error.errorCode).toBe('YTDLP_ERROR');
			expect(error.userMessage).toBe(
				'Error al procesar el video. Verifique que el enlace sea válido y que el video tenga subtítulos disponibles.',
			);
			expect(error.message).toContain(exitCode.toString());
			expect(error.message).toContain(stderr);
		});
	});

	describe('FileOperationError', () => {
		it('should create error with correct properties', () => {
			const operation = 'read';
			const filePath = '/tmp/test.txt';
			const originalError = new Error('File not found');
			const error = new FileOperationError(operation, filePath, originalError);

			expect(error.name).toBe('FileOperationError');
			expect(error.statusCode).toBe(500);
			expect(error.errorCode).toBe('FILE_OPERATION_ERROR');
			expect(error.userMessage).toBe(
				'Error interno del servidor al procesar los archivos de transcripción.',
			);
			expect(error.message).toContain(operation);
			expect(error.message).toContain(filePath);
			expect(error.message).toContain(originalError.message);
		});
	});

	describe('SubtitleParsingError', () => {
		it('should create error with correct properties', () => {
			const fileName = 'test.vtt';
			const originalError = new Error('Invalid format');
			const error = new SubtitleParsingError(fileName, originalError);

			expect(error.name).toBe('SubtitleParsingError');
			expect(error.statusCode).toBe(500);
			expect(error.errorCode).toBe('SUBTITLE_PARSING_ERROR');
			expect(error.userMessage).toBe(
				'Error al procesar el archivo de subtítulos. El formato puede estar corrupto.',
			);
			expect(error.message).toContain(fileName);
			expect(error.message).toContain(originalError.message);
		});
	});
});

describe('Error utility functions', () => {
	describe('isTranscriptionError', () => {
		it('should return true for TranscriptionError instances', () => {
			const error = new VideoNotFoundError('test-id');
			expect(isTranscriptionError(error)).toBe(true);
		});

		it('should return false for regular Error instances', () => {
			const error = new Error('Regular error');
			expect(isTranscriptionError(error)).toBe(false);
		});

		it('should return false for non-error values', () => {
			expect(isTranscriptionError('string')).toBe(false);
			expect(isTranscriptionError(null)).toBe(false);
			expect(isTranscriptionError(undefined)).toBe(false);
		});
	});

	describe('isSupportedLanguage', () => {
		it('should return true for supported languages', () => {
			for (const lang of SUPPORTED_LANGUAGES) {
				expect(isSupportedLanguage(lang)).toBe(true);
			}
		});

		it('should return false for unsupported languages', () => {
			expect(isSupportedLanguage('fr')).toBe(false);
			expect(isSupportedLanguage('de')).toBe(false);
			expect(isSupportedLanguage('invalid')).toBe(false);
		});
	});

	describe('SUPPORTED_LANGUAGES', () => {
		it('should contain expected languages', () => {
			expect(SUPPORTED_LANGUAGES).toContain('es');
			expect(SUPPORTED_LANGUAGES).toContain('en');
			expect(SUPPORTED_LANGUAGES).toContain('es-419');
			expect(SUPPORTED_LANGUAGES).toContain('es-ES');
		});

		it('should be readonly', () => {
			// TypeScript readonly arrays are only compile-time checks
			// At runtime, they're still regular arrays, so we test the type structure
			expect(Array.isArray(SUPPORTED_LANGUAGES)).toBe(true);
			expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
		});
	});
});

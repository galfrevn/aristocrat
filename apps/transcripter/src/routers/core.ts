import { Hono } from 'hono';
import {
	isSupportedLanguage,
	isTranscriptionError,
	UnsupportedLanguageError,
} from '@/errors';
import { authenticationMiddleware } from '@/middlewares/auth';
import { TranscriptService } from '@/services/transcript';
import type { TranscriptRequest } from '@/types';
import { logger } from '@/utils/logger';
import { validateAndSanitizeVideoId } from '@/utils/validation';

const router = new Hono<{ Variables: { userId: string } }>();
const transcriptService = new TranscriptService();

export const aristocratTranscripterCoreRouter = router.post(
	'/extract',
	authenticationMiddleware,
	async (c) => {
		const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;

		try {
			const { videoId, language = 'es' }: TranscriptRequest =
				await c.req.json();
			const userId = c.get('userId');

			logger.info('Transcript extraction request received', {
				requestId,
				userId,
				videoId,
				language,
			});

			// Validate required fields
			if (!videoId) {
				return c.json(
					{
						error: 'El ID del video es requerido',
						errorCode: 'MISSING_VIDEO_ID',
						requestId,
					},
					400,
				);
			}

			// Validate language support
			if (!isSupportedLanguage(language)) {
				const supportedLanguageError = new UnsupportedLanguageError(
					language,
					['es', 'en', 'es-419', 'es-ES'],
					{ requestId, userId },
				);
				return c.json(
					{
						error: supportedLanguageError.userMessage,
						errorCode: supportedLanguageError.errorCode,
						requestId,
					},
					supportedLanguageError.statusCode,
				);
			}

			// Validate and sanitize the video ID to prevent command injection
			let sanitizedVideoId: string;
			try {
				sanitizedVideoId = validateAndSanitizeVideoId(videoId);
			} catch (validationError) {
				if (isTranscriptionError(validationError)) {
					return c.json(
						{
							error: validationError.userMessage,
							errorCode: validationError.errorCode,
							requestId,
						},
						validationError.statusCode,
					);
				}
				throw validationError;
			}

			const result = await transcriptService.extractTranscript(
				sanitizedVideoId,
				language,
				userId,
			);

			logger.info('Transcript extraction completed successfully', {
				requestId,
				userId,
				videoId: sanitizedVideoId,
				language,
				segments: result.segments,
			});

			return c.json({
				transcript: result.transcript,
				videoId: sanitizedVideoId,
				segments: result.segments,
				file: result.file,
				requestId,
			});
		} catch (extractionError) {
			// Handle TranscriptionError instances with proper status codes and user messages
			if (isTranscriptionError(extractionError)) {
				logger.error('Transcription error occurred', extractionError, {
					requestId,
				});

				return c.json(
					{
						error: extractionError.userMessage,
						errorCode: extractionError.errorCode,
						requestId,
					},
					extractionError.statusCode,
				);
			}

			// Handle unexpected errors
			logger.error(
				'Unexpected error during transcription',
				extractionError as Error,
				{ requestId },
			);

			return c.json(
				{
					error: 'Error interno del servidor. Intente nuevamente más tarde.',
					errorCode: 'INTERNAL_SERVER_ERROR',
					requestId,
				},
				500,
			);
		}
	},
);

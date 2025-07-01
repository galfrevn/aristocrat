import { FileOperationError, SubtitleParsingError } from '@/errors';
import { parseSRTSubtitles } from '@/parsers/srt';
import { parseVTTSubtitles } from '@/parsers/vtt';
import type { TranscriptSegment } from '@/types';
import {
	cleanupTempDirectory,
	createTempDirectory,
	downloadSubtitles,
	selectBestSubtitleFile,
} from '@/utils/files';
import {
	logger,
	logTranscriptionError,
	logTranscriptionStart,
	logTranscriptionSuccess,
} from '@/utils/logger';

export class TranscriptService {
	async extractTranscript(
		videoId: string,
		language = 'es',
		userId?: string,
	): Promise<{
		transcript: TranscriptSegment[];
		segments: number;
		file: string;
	}> {
		const startTime = Date.now();
		logTranscriptionStart(videoId, language, userId);

		const temporaryDirectory = await createTempDirectory(videoId);

		try {
			const availableSubtitleFiles = await downloadSubtitles(
				videoId,
				language,
				temporaryDirectory,
			);
			const selectedSubtitleFile = selectBestSubtitleFile(
				availableSubtitleFiles,
			);

			logger.info('Processing subtitle file', {
				videoId,
				language,
				userId,
				selectedFile: selectedSubtitleFile,
				availableFiles: availableSubtitleFiles,
			});

			let subtitleFileContent: string;
			try {
				subtitleFileContent = await Bun.file(
					`${temporaryDirectory}/${selectedSubtitleFile}`,
				).text();
			} catch (error) {
				throw new FileOperationError(
					'read',
					`${temporaryDirectory}/${selectedSubtitleFile}`,
					error as Error,
					{ videoId, language, userId },
				);
			}

			let parsedTranscript: TranscriptSegment[];
			try {
				parsedTranscript = selectedSubtitleFile.endsWith('.vtt')
					? parseVTTSubtitles(subtitleFileContent)
					: parseSRTSubtitles(subtitleFileContent);
			} catch (error) {
				throw new SubtitleParsingError(selectedSubtitleFile, error as Error, {
					videoId,
					language,
					userId,
				});
			}

			const duration = Date.now() - startTime;
			logTranscriptionSuccess(
				videoId,
				language,
				parsedTranscript.length,
				duration,
				userId,
			);

			return {
				transcript: parsedTranscript,
				segments: parsedTranscript.length,
				file: selectedSubtitleFile,
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			logTranscriptionError(
				error as Error,
				videoId,
				language,
				userId,
				duration,
			);
			throw error;
		} finally {
			await cleanupTempDirectory(temporaryDirectory);
		}
	}
}

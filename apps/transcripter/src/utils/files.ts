import { $ } from 'bun';
import {
	FileOperationError,
	TranscriptNotAvailableError,
	VideoNotFoundError,
	YtDlpError,
} from '@/errors';
import { logExternalServiceError, logger } from '@/utils/logger';
import { withRetry, YT_DLP_RETRY_OPTIONS } from '@/utils/retry';

export async function downloadSubtitles(
	videoId: string,
	language: string,
	tempDir: string,
): Promise<string[]> {
	try {
		return await withRetry(async () => {
			const process = $`cd ${tempDir} && yt-dlp --write-auto-sub --write-sub --sub-langs "${language}" --skip-download --output "%(id)s.%(ext)s" "https://youtube.com/watch?v=${videoId}"`;

			const result = await process;

			// Check if yt-dlp failed
			if (result.exitCode !== 0) {
				const stderr = await result.stderr.text();

				// Parse specific error types from yt-dlp output
				if (
					stderr.includes('Video unavailable') ||
					stderr.includes('Private video') ||
					stderr.includes('This video is not available')
				) {
					throw new VideoNotFoundError(videoId, { stderr });
				}

				if (
					stderr.includes('No automatic captions') ||
					stderr.includes('No subtitles')
				) {
					throw new TranscriptNotAvailableError(videoId, language, { stderr });
				}

				throw new YtDlpError(result.exitCode, stderr, { videoId, language });
			}

			const directoryListing = await $`ls ${tempDir}`.text();
			const availableSubtitleFiles = directoryListing
				.split('\n')
				.filter(
					(fileName) =>
						fileName.trim() &&
						(fileName.endsWith('.vtt') || fileName.endsWith('.srt')),
				);

			if (availableSubtitleFiles.length === 0) {
				throw new TranscriptNotAvailableError(videoId, language, {
					reason: 'No subtitle files found after download',
					tempDir,
				});
			}

			logger.info('Subtitles downloaded successfully', {
				videoId,
				language,
				fileCount: availableSubtitleFiles.length,
				files: availableSubtitleFiles,
			});

			return availableSubtitleFiles;
		}, YT_DLP_RETRY_OPTIONS);
	} catch (error) {
		logExternalServiceError('yt-dlp', error as Error, {
			videoId,
			language,
			tempDir,
		});
		throw error;
	}
}

export function selectBestSubtitleFile(availableFiles: string[]): string {
	return (
		availableFiles.find(
			(fileName) => fileName.includes('.es.') || fileName.includes('.es-'),
		) || availableFiles[0]
	);
}

export async function createTempDirectory(videoId: string): Promise<string> {
	const temporaryDirectory = `/tmp/transcript_${videoId}_${Date.now()}`;

	try {
		await $`mkdir -p ${temporaryDirectory}`;
		logger.debug('Temporary directory created', {
			tempDir: temporaryDirectory,
			videoId,
		});
		return temporaryDirectory;
	} catch (error) {
		throw new FileOperationError('create', temporaryDirectory, error as Error, {
			videoId,
		});
	}
}

export async function cleanupTempDirectory(tempDir: string): Promise<void> {
	try {
		await $`rm -rf ${tempDir}`.nothrow();
		logger.debug('Temporary directory cleaned up', { tempDir });
	} catch (error) {
		logger.warn('Failed to cleanup temporary directory', {
			tempDir,
			error: (error as Error).message,
		});
		// Don't throw here since cleanup is not critical
	}
}

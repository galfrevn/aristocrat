import { parseSRTSubtitles } from '@/parsers/srt';
import { parseVTTSubtitles } from '@/parsers/vtt';
import type { TranscriptSegment } from '@/types';
import {
	cleanupTempDirectory,
	createTempDirectory,
	downloadSubtitles,
	selectBestSubtitleFile,
} from '@/utils/files';

export class TranscriptService {
	async extractTranscript(
		videoId: string,
		language = 'es',
	): Promise<{
		transcript: TranscriptSegment[];
		segments: number;
		file: string;
	}> {
		console.log(
			`Extracting transcript for video: ${videoId}, language: ${language}`,
		);

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

			console.log(`Processing subtitle file: ${selectedSubtitleFile}`);

			const subtitleFileContent = await Bun.file(
				`${temporaryDirectory}/${selectedSubtitleFile}`,
			).text();

			const parsedTranscript = selectedSubtitleFile.endsWith('.vtt')
				? parseVTTSubtitles(subtitleFileContent)
				: parseSRTSubtitles(subtitleFileContent);

			return {
				transcript: parsedTranscript,
				segments: parsedTranscript.length,
				file: selectedSubtitleFile,
			};
		} finally {
			await cleanupTempDirectory(temporaryDirectory);
		}
	}
}

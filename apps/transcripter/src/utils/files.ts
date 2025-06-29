import { $ } from 'bun';

export async function downloadSubtitles(
	videoId: string,
	language: string,
	tempDir: string,
): Promise<string[]> {
	await $`cd ${tempDir} && yt-dlp --write-auto-sub --write-sub --sub-langs "${language},en,es-419,es-ES" --skip-download --output "%(id)s.%(ext)s" "https://youtube.com/watch?v=${videoId}"`;

	const directoryListing = await $`ls ${tempDir}`.text();
	const availableSubtitleFiles = directoryListing
		.split('\n')
		.filter(
			(fileName) =>
				fileName.trim() &&
				(fileName.endsWith('.vtt') || fileName.endsWith('.srt')),
		);

	if (availableSubtitleFiles.length === 0) {
		throw new Error(`No subtitle files found for video ${videoId}`);
	}

	return availableSubtitleFiles;
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
	await $`mkdir -p ${temporaryDirectory}`;
	return temporaryDirectory;
}

export async function cleanupTempDirectory(tempDir: string): Promise<void> {
	await $`rm -rf ${tempDir}`.nothrow();
}

import type { TranscriptSegment } from '@/types';
import { convertSecondsToHHMMSS, convertVTTTimeToSeconds } from '@/utils/time';

export function parseVTTSubtitles(vttContent: string): TranscriptSegment[] {
	const transcriptSegments: TranscriptSegment[] = [];
	const contentLines = vttContent.split('\n');

	for (let lineIndex = 0; lineIndex < contentLines.length; lineIndex++) {
		const currentLine = contentLines[lineIndex].trim();

		if (currentLine.includes('-->')) {
			const [segmentStartTime] = currentLine
				.split('-->')
				.map((timeString) => timeString.trim());

			const startTimeInSeconds = convertVTTTimeToSeconds(segmentStartTime);

			const subtitleTextLines = [];
			for (
				let nextLineIndex = lineIndex + 1;
				nextLineIndex < contentLines.length;
				nextLineIndex++
			) {
				if (contentLines[nextLineIndex].trim() === '') break;
				if (contentLines[nextLineIndex].includes('-->')) break;
				subtitleTextLines.push(contentLines[nextLineIndex].trim());
			}

			if (subtitleTextLines.length > 0) {
				transcriptSegments.push({
					text: subtitleTextLines.join(' ').replace(/<[^>]*>/g, ''),
					start: convertSecondsToHHMMSS(startTimeInSeconds),
				});
			}
		}
	}

	return transcriptSegments;
}

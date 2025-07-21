import type { TranscriptSegment } from '@/types';
import { convertSecondsToHHMMSS, convertSRTTimeToSeconds } from '@/utils/time';

export function parseSRTSubtitles(srtContent: string): TranscriptSegment[] {
	const transcriptSegments: TranscriptSegment[] = [];
	const subtitleBlocks = srtContent
		.split('\n\n')
		.filter((block) => block.trim());

	// Pre-compile regex for better performance
	const htmlTagRegex = /<[^>]*>/g;

	for (const subtitleBlock of subtitleBlocks) {
		const blockLines = subtitleBlock.split('\n');
		if (blockLines.length >= 3) {
			const timestampLine = blockLines[1];
			if (timestampLine.includes('-->')) {
				const [segmentStartTime] = timestampLine
					.split('-->')
					.map((timeString) => timeString.trim());
				const startTimeInSeconds = convertSRTTimeToSeconds(segmentStartTime);

				// More efficient string building without intermediate arrays
				let subtitleText = '';
				for (let i = 2; i < blockLines.length; i++) {
					if (i > 2) subtitleText += ' ';
					subtitleText += blockLines[i];
				}

				// Only apply regex if HTML tags are detected
				if (subtitleText.includes('<')) {
					subtitleText = subtitleText.replace(htmlTagRegex, '');
				}

				transcriptSegments.push({
					text: subtitleText,
					start: convertSecondsToHHMMSS(startTimeInSeconds),
				});
			}
		}
	}

	return transcriptSegments;
}

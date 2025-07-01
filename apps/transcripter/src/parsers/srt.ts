import type { TranscriptSegment } from '@/types';
import { convertSecondsToHHMMSS, convertSRTTimeToSeconds } from '@/utils/time';

export function parseSRTSubtitles(srtContent: string): TranscriptSegment[] {
	const transcriptSegments: TranscriptSegment[] = [];
	const subtitleBlocks = srtContent
		.split('\n\n')
		.filter((block) => block.trim());

	for (const subtitleBlock of subtitleBlocks) {
		const blockLines = subtitleBlock.split('\n');
		if (blockLines.length >= 3) {
			const timestampLine = blockLines[1];
			if (timestampLine.includes('-->')) {
				const [segmentStartTime] = timestampLine
					.split('-->')
					.map((timeString) => timeString.trim());
				const startTimeInSeconds = convertSRTTimeToSeconds(segmentStartTime);

				const subtitleText = blockLines
					.slice(2)
					.join(' ')
					.replace(/<[^>]*>/g, '');

				transcriptSegments.push({
					text: subtitleText,
					start: convertSecondsToHHMMSS(startTimeInSeconds),
				});
			}
		}
	}

	return transcriptSegments;
}

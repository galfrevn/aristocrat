export function convertVTTTimeToSeconds(vttTimeString: string): number {
	const timeParts = vttTimeString.split(':');

	if (timeParts.length === 3) {
		const hours = Number.parseInt(timeParts[0]) || 0;
		const minutes = Number.parseInt(timeParts[1]) || 0;
		const [secondsPart, millisecondsPart = '0'] = timeParts[2].split('.');
		const seconds = Number.parseInt(secondsPart) || 0;
		const milliseconds = Number.parseInt(millisecondsPart.padEnd(3, '0')) || 0;

		return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
	}

	if (timeParts.length === 2) {
		const minutes = Number.parseInt(timeParts[0]) || 0;
		const [secondsPart, millisecondsPart = '0'] = timeParts[1].split('.');
		const seconds = Number.parseInt(secondsPart) || 0;
		const milliseconds = Number.parseInt(millisecondsPart.padEnd(3, '0')) || 0;

		return minutes * 60 + seconds + milliseconds / 1000;
	}

	return 0;
}

export function convertSRTTimeToSeconds(srtTimeString: string): number {
	const [timePart, millisecondsString = '0'] = srtTimeString.split(',');
	const [hours, minutes, seconds] = timePart.split(':').map(Number);
	const milliseconds = Number.parseInt(millisecondsString);

	return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

export function convertSecondsToHHMMSS(totalSecondsInput: number): string {
	const hours = Math.floor(totalSecondsInput / 3600);
	const minutes = Math.floor((totalSecondsInput % 3600) / 60);
	const seconds = Math.floor(totalSecondsInput % 60);

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

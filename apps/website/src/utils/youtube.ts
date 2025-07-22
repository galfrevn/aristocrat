export const validateYouTubeInput = (input: string): boolean => {
	const idPattern = /^[a-zA-Z0-9_-]{11}$/;
	const urlPatterns = [
		/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
		/^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
	];

	return (
		urlPatterns.some((pattern) => pattern.test(input)) || idPattern.test(input)
	);
};

export const youtubeUrlRegex =
	/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

export const generateVideoUrlFromId = (videoId: string) => {
	return `https://www.youtube.com/watch?v=${videoId}`;
};

export const generateThumbnailUrlFromId = (videoId: string) => {
	return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const timeToSeconds = (time: string): number => {
	const parts = time.split(':').map(Number);
	if (parts.length === 3) {
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	}
	if (parts.length === 2) {
		return parts[0] * 60 + parts[1];
	}
	return parts[0] || 0;
};

export const generateEmbedUrlFromId = (
	videoId: string,
	options?: { start?: string; end?: string },
) => {
	const url = new URL(`https://www.youtube.com/embed/${videoId}`);

	if (options?.start) {
		url.searchParams.set('start', timeToSeconds(options.start).toString());
	}

	if (options?.end) {
		url.searchParams.set('end', timeToSeconds(options.end).toString());
	}

	return url.toString();
};

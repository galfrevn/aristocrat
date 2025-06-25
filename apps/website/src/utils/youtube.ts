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

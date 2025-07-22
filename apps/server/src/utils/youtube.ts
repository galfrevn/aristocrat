const youtubeInformationUrl =
	'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=';

interface YoutubeVideoDetails {
	title: string;
	author_name: string;
	thumbnail_url: string;
}

export const getYoutubeInformation = async (videoId: string) =>
	fetch(`${youtubeInformationUrl}${videoId}&format=json`)
		.then((response) => response.json() as Promise<YoutubeVideoDetails>)
		.catch((error) => {
			console.error('Error fetching YouTube video information:', error);
		});

export const getYoutubeVideoIdFromUrl = (url: string): string => {
	const youtubeUrlPatterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/,
	];

	for (const urlPattern of youtubeUrlPatterns) {
		const matchResult = url.match(urlPattern);
		if (matchResult) return matchResult[1];
	}

	return '';
};

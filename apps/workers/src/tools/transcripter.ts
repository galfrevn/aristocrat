interface TranscriptRequest {
	videoId: string;
	language?: string;
}

interface TranscriptSegment {
	text: string;
	start: string;
}

export interface TranscriptResponse {
	transcript: TranscriptSegment[];
	videoId: string;
	segments: number;
	file: string;
}

export class TranscripterService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = process.env.TRANSCRIPTER_URL || 'http://localhost:3002';
	}

	async extractTranscript(
		videoId: string,
		language = 'en',
	): Promise<TranscriptResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/extract`, {
				method: 'POST',
				body: JSON.stringify({
					videoId,
					language,
				} as TranscriptRequest),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					`Transcripter service error: ${response.status} - ${errorData.error || response.statusText}`,
				);
			}

			const data: TranscriptResponse = await response.json();
			return data;
		} catch (error) {
			console.error('Error calling transcripter service:', error);

			if (error instanceof Error) {
				throw new Error(`Failed to extract transcript: ${error.message}`);
			}

			throw new Error('Failed to extract transcript: Unknown error');
		}
	}
}

interface PrepareTranscriptForAiConfiguration {
	maximumSegments?: number;
}

export const prepareTranscriptForAi = (
	{ transcript }: TranscriptResponse,
	configuration?: PrepareTranscriptForAiConfiguration,
) => transcript.slice(0, configuration?.maximumSegments);

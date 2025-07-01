export interface TranscriptRequest {
	videoId: string;
	language?: string;
}

export interface TranscriptSegment {
	text: string;
	start: string;
}

export interface TranscriptResponse {
	transcript: TranscriptSegment[];
	videoId: string;
	segments: number;
	file: string;
}

export interface ErrorResponse {
	error: string;
	videoId?: string;
}

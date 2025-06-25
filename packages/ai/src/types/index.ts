import type {
	CoreMessage,
	GenerateObjectResult,
	GenerateTextResult,
	StreamTextResult,
} from 'ai';
import type { z } from 'zod';

export type AIProvider =
	| 'openai'
	| 'anthropic'
	| 'google'
	| 'mistral'
	| 'perplexity';

export interface AIConfiguration {
	provider: AIProvider;
	modelName: string;
	apiKey?: string;
	baseURL?: string;
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
}

export interface AITextOptions {
	messages: CoreMessage[];
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
	seed?: number;
	stopSequences?: string[];
}

export interface AIObjectGenerationOptions<T extends z.ZodType>
	extends Omit<AITextOptions, 'messages'> {
	messages: CoreMessage[];
	schema: T;
	schemaName?: string;
	schemaDescription?: string;
}

export interface AIStreamingOptions extends AITextOptions {
	onChunk?: (chunkContent: string) => void;
	onFinish?: (completionResult: { text: string; usage?: AIUsage }) => void;
	onError?: (errorDetails: Error) => void;
}

export interface AIError extends Error {
	errorCode: string;
	provider: AIProvider;
	modelName: string;
	isRetryable: boolean;
}

export interface AIUsage {
	promptTokens?: number;
	completionTokens?: number;
	totalTokens?: number;
}

export type AITextResponse = GenerateTextResult<Record<string, never>, never>;
export type AIObjectResponse<T> = GenerateObjectResult<T>;
export type AIStreamResponse = StreamTextResult<Record<string, never>, never>;

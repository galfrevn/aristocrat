import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import type { AIConfiguration } from '@/types';

export function createOpenAIProvider(
	configuration: AIConfiguration,
): LanguageModel {
	if (configuration.provider !== 'openai') {
		throw new Error('Provider must be "openai"');
	}

	// Create provider instance with settings
	const provider = createOpenAI({
		apiKey: configuration.apiKey,
		baseURL: configuration.baseURL,
	});

	// Return the model instance
	return provider(configuration.modelName);
}

export const OPENAI_MODELS = {
	'gpt-4.1': 'gpt-4.1',
	'gpt-4.1-mini': 'gpt-4.1-mini',
	'gpt-4.1-nano': 'gpt-4.1-nano',
	'gpt-4o': 'gpt-4o',
	'gpt-4o-mini': 'gpt-4o-mini',
	o1: 'o1',
	'o1-mini': 'o1-mini',
	'o3-mini': 'o3-mini',
	o3: 'o3',
	'o4-mini': 'o4-mini',
	'chatgpt-4o-latest': 'chatgpt-4o-latest',
} as const;

export type OpenAIModelName = keyof typeof OPENAI_MODELS;

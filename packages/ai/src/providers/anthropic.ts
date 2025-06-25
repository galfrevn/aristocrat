import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';
import type { AIConfiguration } from '@/types';

export function createAnthropicProvider(
	configuration: AIConfiguration,
): LanguageModel {
	if (configuration.provider !== 'anthropic') {
		throw new Error('Provider must be "anthropic"');
	}

	// Create provider instance with settings
	const provider = createAnthropic({
		apiKey: configuration.apiKey,
		baseURL: configuration.baseURL,
	});

	// Return the model instance
	return provider(configuration.modelName);
}

export const ANTHROPIC_MODELS = {
	'claude-4-opus-20250514': 'claude-4-opus-20250514',
	'claude-4-sonnet-20250514': 'claude-4-sonnet-20250514',
	'claude-3-7-sonnet-20250219': 'claude-3-7-sonnet-20250219',
	'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
	'claude-3-5-haiku-20241022': 'claude-3-5-haiku-20241022',
} as const;

export type AnthropicModelName = keyof typeof ANTHROPIC_MODELS;

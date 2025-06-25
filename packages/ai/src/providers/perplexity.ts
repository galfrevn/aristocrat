import { createPerplexity } from '@ai-sdk/perplexity';
import type { LanguageModel } from 'ai';
import type { AIConfiguration } from '@/types';

export function createPerplexityProvider(
	configuration: AIConfiguration,
): LanguageModel {
	if (configuration.provider !== 'perplexity') {
		throw new Error('Provider must be "perplexity"');
	}

	// Create provider instance with settings
	const provider = createPerplexity({
		apiKey: configuration.apiKey,
		baseURL: configuration.baseURL,
	});

	// Return the model instance
	return provider(configuration.modelName);
}

export const PERPLEXITY_MODELS = {
	'sonar-deep-research': 'sonar-deep-research',
	'sonar-reasoning-pro': 'sonar-reasoning-pro',
	'sonar-reasoning': 'sonar-reasoning',
	'sonar-pro': 'sonar-pro',
	sonar: 'sonar',
} as const;

export type PerplexityModelName = keyof typeof PERPLEXITY_MODELS;

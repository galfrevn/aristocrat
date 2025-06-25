import type { LanguageModel } from 'ai';
import type { AIConfiguration } from '@/types';

import { createAnthropicProvider } from './anthropic';
import { createOpenAIProvider } from './openai';
import { createPerplexityProvider } from './perplexity';

export function createProvider(configuration: AIConfiguration): LanguageModel {
	switch (configuration.provider) {
		case 'openai':
			return createOpenAIProvider(configuration);
		case 'anthropic':
			return createAnthropicProvider(configuration);
		case 'perplexity':
			return createPerplexityProvider(configuration);
		default:
			throw new Error(`Unsupported AI provider: ${configuration.provider}`);
	}
}

export * from './anthropic';
export * from './openai';
export * from './perplexity';

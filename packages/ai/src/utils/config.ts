import type { AIConfiguration, AIProvider } from '@/types';

export const DEFAULT_PROVIDER_CONFIGURATIONS: Record<
	AIProvider,
	Partial<AIConfiguration>
> = {
	openai: {
		temperature: 0.7,
		maxTokens: 4096,
		topP: 1,
		frequencyPenalty: 0,
		presencePenalty: 0,
	},
	anthropic: {
		temperature: 0.7,
		maxTokens: 4096,
		topP: 1,
	},
	google: {
		temperature: 0.7,
		maxTokens: 4096,
		topP: 1,
	},
	mistral: {
		temperature: 0.7,
		maxTokens: 4096,
		topP: 1,
	},
	perplexity: {
		temperature: 0.7,
		maxTokens: 4096,
		topP: 1,
	},
};

export function mergeConfiguration(
	baseConfiguration: AIConfiguration,
	configurationOverrides: Partial<AIConfiguration> = {},
): AIConfiguration {
	const providerDefaults =
		DEFAULT_PROVIDER_CONFIGURATIONS[baseConfiguration.provider];

	return {
		...providerDefaults,
		...baseConfiguration,
		...configurationOverrides,
	};
}

export function validateConfiguration(configuration: AIConfiguration): void {
	if (!configuration.provider) {
		throw new Error('AI provider is required');
	}

	if (!configuration.modelName) {
		throw new Error('Model name is required');
	}

	if (
		configuration.temperature !== undefined &&
		(configuration.temperature < 0 || configuration.temperature > 2)
	) {
		throw new Error('Temperature must be between 0 and 2');
	}

	if (configuration.maxTokens !== undefined && configuration.maxTokens < 1) {
		throw new Error('Maximum tokens must be greater than 0');
	}

	if (
		configuration.topP !== undefined &&
		(configuration.topP < 0 || configuration.topP > 1)
	) {
		throw new Error('Top P must be between 0 and 1');
	}
}

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

	if (
		configuration.frequencyPenalty !== undefined &&
		(configuration.frequencyPenalty < -2 || configuration.frequencyPenalty > 2)
	) {
		throw new Error('Frequency penalty must be between -2 and 2');
	}

	if (
		configuration.presencePenalty !== undefined &&
		(configuration.presencePenalty < -2 || configuration.presencePenalty > 2)
	) {
		throw new Error('Presence penalty must be between -2 and 2');
	}

	if (configuration.apiKey !== undefined) {
		validateApiKey(configuration.apiKey, configuration.provider);
	}
}

function validateApiKey(apiKey: string, provider: AIProvider): void {
	if (!apiKey || apiKey.trim().length === 0) {
		throw new Error('API key cannot be empty');
	}

	// Basic API key format validation based on provider
	switch (provider) {
		case 'openai': {
			if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
				throw new Error('Invalid OpenAI API key format');
			}
			break;
		}
		case 'anthropic': {
			if (!apiKey.startsWith('sk-ant-') || apiKey.length < 20) {
				throw new Error('Invalid Anthropic API key format');
			}
			break;
		}
		case 'perplexity': {
			if (!apiKey.startsWith('pplx-') || apiKey.length < 20) {
				throw new Error('Invalid Perplexity API key format');
			}
			break;
		}
		default: {
			// Generic validation for unknown providers
			if (apiKey.length < 10) {
				throw new Error('API key appears to be too short');
			}
		}
	}

	// Security check - ensure API key doesn't contain obvious test/placeholder values
	const suspiciousPatterns = [
		'test',
		'demo',
		'placeholder',
		'example',
		'your-key',
	];
	const lowerKey = apiKey.toLowerCase();

	for (const pattern of suspiciousPatterns) {
		if (lowerKey.includes(pattern)) {
			throw new Error('API key appears to be a placeholder or test value');
		}
	}
}

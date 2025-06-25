import type { AIConfiguration, AIProvider } from '@/types';
import { mergeConfiguration, validateConfiguration } from '@/utils/config';

describe('validateConfiguration', () => {
	test('should throw error when provider is missing', () => {
		const config = {
			modelName: 'gpt-4',
		} as AIConfiguration;

		expect(() => validateConfiguration(config)).toThrow(
			'AI provider is required',
		);
	});

	test('should throw error when model name is missing', () => {
		const config = {
			provider: 'openai' as AIProvider,
		} as AIConfiguration;

		expect(() => validateConfiguration(config)).toThrow(
			'Model name is required',
		);
	});

	test('should throw error when temperature is out of range', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			temperature: 3,
		};

		expect(() => validateConfiguration(config)).toThrow(
			'Temperature must be between 0 and 2',
		);
	});

	test('should throw error when frequency penalty is out of range', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			frequencyPenalty: 3,
		};

		expect(() => validateConfiguration(config)).toThrow(
			'Frequency penalty must be between -2 and 2',
		);
	});

	test('should throw error when presence penalty is out of range', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			presencePenalty: -3,
		};

		expect(() => validateConfiguration(config)).toThrow(
			'Presence penalty must be between -2 and 2',
		);
	});

	test('should pass validation with valid configuration', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			temperature: 0.7,
			maxTokens: 1000,
			topP: 0.9,
			frequencyPenalty: 0.5,
			presencePenalty: -0.5,
		};

		expect(() => validateConfiguration(config)).not.toThrow();
	});

	test('should throw error for invalid OpenAI API key format', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			apiKey: 'invalid-key',
		};

		expect(() => validateConfiguration(config)).toThrow(
			'Invalid OpenAI API key format',
		);
	});

	test('should throw error for placeholder API key', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			apiKey: 'sk-test-key-placeholder-value',
		};

		expect(() => validateConfiguration(config)).toThrow(
			'API key appears to be a placeholder or test value',
		);
	});

	test('should pass validation with valid OpenAI API key', () => {
		const config: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
			apiKey: 'sk-1234567890abcdef1234567890abcdef',
		};

		expect(() => validateConfiguration(config)).not.toThrow();
	});
});

describe('mergeConfiguration', () => {
	test('should merge base configuration with provider defaults', () => {
		const baseConfig: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
		};

		const merged = mergeConfiguration(baseConfig);

		expect(merged.temperature).toBe(0.7);
		expect(merged.maxTokens).toBe(4096);
		expect(merged.topP).toBe(1);
		expect(merged.frequencyPenalty).toBe(0);
		expect(merged.presencePenalty).toBe(0);
	});

	test('should override defaults with configuration overrides', () => {
		const baseConfig: AIConfiguration = {
			provider: 'openai',
			modelName: 'gpt-4',
		};

		const overrides = {
			temperature: 0.5,
			maxTokens: 2000,
		};

		const merged = mergeConfiguration(baseConfig, overrides);

		expect(merged.temperature).toBe(0.5);
		expect(merged.maxTokens).toBe(2000);
		expect(merged.topP).toBe(1); // should keep default
	});
});

import type { AIConfiguration, AITextOptions } from '@/types';

// Create mock functions
const mockGenerateText = jest.fn();
const mockCreateProvider = jest.fn();
const mockCreateAIError = jest.fn();
const mockWithRetry = jest.fn((fn) => fn());

// Mock the modules
jest.mock('ai', () => ({
	generateText: mockGenerateText,
}));

jest.mock('@/providers', () => ({
	createProvider: mockCreateProvider,
}));

jest.mock('@/utils/errors', () => ({
	...jest.requireActual('@/utils/errors'),
	createAIError: mockCreateAIError,
	withRetry: mockWithRetry,
}));

// Import after mocks are set up
const { generateAIText } = require('@/core/text');

describe('generateAIText', () => {
	const mockConfiguration: AIConfiguration = {
		provider: 'openai',
		modelName: 'gpt-4',
		apiKey: 'sk-1234567890abcdef1234567890abcdef',
		temperature: 0.7,
		maxTokens: 1000,
	};

	const mockTextOptions: AITextOptions = {
		messages: [{ role: 'user', content: 'Hello, world!' }],
		temperature: 0.8,
		maxTokens: 500,
	};

	const mockLanguageModel = { modelId: 'gpt-4' };
	const mockResponse = {
		text: 'Hello! How can I help you today?',
		usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockCreateProvider.mockReturnValue(mockLanguageModel as any);
		mockGenerateText.mockResolvedValue(mockResponse as any);
	});

	test('should generate text successfully with valid configuration', async () => {
		const result = await generateAIText(mockConfiguration, mockTextOptions);

		expect(mockCreateProvider).toHaveBeenCalledWith(
			expect.objectContaining({
				provider: 'openai',
				modelName: 'gpt-4',
				temperature: 0.8, // Should use the value from textOptions
				maxTokens: 500, // Should use the value from textOptions
			}),
		);

		expect(mockGenerateText).toHaveBeenCalledWith(
			expect.objectContaining({
				model: mockLanguageModel,
				messages: mockTextOptions.messages,
				temperature: 0.8,
				maxTokens: 500,
			}),
		);

		expect(result).toBe(mockResponse);
	});

	test('should merge configuration with text options', async () => {
		await generateAIText(mockConfiguration, mockTextOptions);

		expect(mockCreateProvider).toHaveBeenCalledWith(
			expect.objectContaining({
				temperature: 0.8, // From textOptions, overriding configuration
				maxTokens: 500, // From textOptions, overriding configuration
			}),
		);
	});

	test('should handle errors and create AI error', async () => {
		const mockError = new Error('API Error');
		const mockAIError = new Error('AI Provider Error');

		mockGenerateText.mockRejectedValue(mockError);
		mockCreateAIError.mockReturnValue(mockAIError as any);

		await expect(
			generateAIText(mockConfiguration, mockTextOptions),
		).rejects.toBe(mockAIError);

		expect(mockCreateAIError).toHaveBeenCalledWith(
			mockError,
			mockConfiguration.provider,
			mockConfiguration.modelName,
		);
	});

	test('should pass stop sequences and seed to generateText', async () => {
		const textOptionsWithExtras: AITextOptions = {
			...mockTextOptions,
			seed: 12345,
			stopSequences: ['</s>', '\n\n'],
		};

		await generateAIText(mockConfiguration, textOptionsWithExtras);

		expect(mockGenerateText).toHaveBeenCalledWith(
			expect.objectContaining({
				seed: 12345,
				stopSequences: ['</s>', '\n\n'],
			}),
		);
	});
});

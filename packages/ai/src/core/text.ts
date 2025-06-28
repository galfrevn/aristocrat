import { generateText } from 'ai';
import { createProvider } from '@/providers';
import type { AIConfiguration, AITextOptions, AITextResponse } from '@/types';
import { mergeConfiguration, validateConfiguration } from '@/utils/config';
import { createAIError, withRetry } from '@/utils/errors';

export async function generateAIText(
	configuration: AIConfiguration,
	textOptions: AITextOptions,
): Promise<AITextResponse> {
	const finalConfiguration = mergeConfiguration(configuration, {
		temperature: textOptions.temperature,
		maxTokens: textOptions.maxTokens,
		topP: textOptions.topP,
		frequencyPenalty: textOptions.frequencyPenalty,
		presencePenalty: textOptions.presencePenalty,
	});

	validateConfiguration(finalConfiguration);

	try {
		const languageModel = createProvider(finalConfiguration);

		return await withRetry(async () => {
			return await generateText({
				model: languageModel,
				messages: textOptions.messages,
				temperature: finalConfiguration.temperature,
				maxTokens: finalConfiguration.maxTokens,
				topP: finalConfiguration.topP,
				frequencyPenalty: finalConfiguration.frequencyPenalty,
				presencePenalty: finalConfiguration.presencePenalty,
				seed: textOptions.seed,
				stopSequences: textOptions.stopSequences || [],
			});
		});
	} catch (caughtError) {
		throw createAIError(
			caughtError,
			configuration.provider,
			configuration.modelName,
		);
	}
}

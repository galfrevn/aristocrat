import { generateObject } from 'ai';
import type { z } from 'zod';
import { createProvider } from '@/providers';
import type {
	AIConfiguration,
	AIObjectGenerationOptions,
	AIObjectResponse,
} from '@/types';
import { mergeConfiguration, validateConfiguration } from '@/utils/config';
import { createAIError, withRetry } from '@/utils/errors';

export async function generateAIObject<T extends z.ZodType>(
	configuration: AIConfiguration,
	objectOptions: AIObjectGenerationOptions<T>,
): Promise<AIObjectResponse<z.infer<T>>> {
	const finalConfiguration = mergeConfiguration(configuration, {
		temperature: objectOptions.temperature,
		maxTokens: objectOptions.maxTokens,
		topP: objectOptions.topP,
		frequencyPenalty: objectOptions.frequencyPenalty,
		presencePenalty: objectOptions.presencePenalty,
	});

	validateConfiguration(finalConfiguration);

	try {
		const languageModel = createProvider(finalConfiguration);

		return await withRetry(async () => {
			return await generateObject({
				model: languageModel,
				messages: objectOptions.messages,
				schema: objectOptions.schema,
				schemaName: objectOptions.schemaName,
				schemaDescription: objectOptions.schemaDescription,
				temperature: finalConfiguration.temperature,
				maxTokens: finalConfiguration.maxTokens,
				topP: finalConfiguration.topP,
				frequencyPenalty: finalConfiguration.frequencyPenalty,
				presencePenalty: finalConfiguration.presencePenalty,
				seed: objectOptions.seed,
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

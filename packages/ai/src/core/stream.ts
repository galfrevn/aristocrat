import { streamText } from 'ai';
import { createProvider } from '@/providers';
import type {
	AIConfiguration,
	AIStreamingOptions,
	AIStreamResponse,
} from '@/types';
import { mergeConfiguration, validateConfiguration } from '@/utils/config';
import { createAIError, withRetry } from '@/utils/errors';

export async function streamAIText(
	configuration: AIConfiguration,
	streamingOptions: AIStreamingOptions,
): Promise<AIStreamResponse> {
	const finalConfiguration = mergeConfiguration(configuration, {
		temperature: streamingOptions.temperature,
		maxTokens: streamingOptions.maxTokens,
		topP: streamingOptions.topP,
		frequencyPenalty: streamingOptions.frequencyPenalty,
		presencePenalty: streamingOptions.presencePenalty,
	});

	validateConfiguration(finalConfiguration);

	try {
		const languageModel = createProvider(finalConfiguration);

		return await withRetry(async () => {
			const textStream = await streamText({
				model: languageModel,
				messages: streamingOptions.messages,
				temperature: finalConfiguration.temperature,
				maxTokens: finalConfiguration.maxTokens,
				topP: finalConfiguration.topP,
				frequencyPenalty: finalConfiguration.frequencyPenalty,
				presencePenalty: finalConfiguration.presencePenalty,
				seed: streamingOptions.seed,
				stopSequences: streamingOptions.stopSequences || [],
				onChunk: streamingOptions.onChunk
					? ({ chunk }) => {
							if (chunk.type === 'text-delta') {
								streamingOptions.onChunk?.(chunk.textDelta);
							}
						}
					: undefined,
				onFinish: streamingOptions.onFinish
					? async ({ text, usage }) => {
							streamingOptions.onFinish?.({ text, usage });
						}
					: undefined,
			});

			return textStream;
		});
	} catch (caughtError) {
		if (streamingOptions.onError) {
			streamingOptions.onError(
				createAIError(
					caughtError,
					configuration.provider,
					configuration.modelName,
				),
			);
		}
		throw createAIError(
			caughtError,
			configuration.provider,
			configuration.modelName,
		);
	}
}

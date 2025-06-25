import type { z } from 'zod';
import { generateAIObject } from '@/core/object';
import { streamAIText } from '@/core/stream';
import { generateAIText } from '@/core/text';
import type {
	AIConfiguration,
	AIObjectGenerationOptions,
	AIObjectResponse,
	AIStreamingOptions,
	AIStreamResponse,
	AITextOptions,
	AITextResponse,
} from '@/types';
import { mergeConfiguration } from '@/utils/config';

export class AristocratsAI {
	private configuration: AIConfiguration;

	constructor(configuration: AIConfiguration) {
		this.configuration = configuration;
	}

	async generateText(textOptions: AITextOptions): Promise<AITextResponse> {
		return generateAIText(this.configuration, textOptions);
	}

	async streamText(
		streamingOptions: AIStreamingOptions,
	): Promise<AIStreamResponse> {
		return streamAIText(this.configuration, streamingOptions);
	}

	async generateObject<T extends z.ZodType>(
		objectOptions: AIObjectGenerationOptions<T>,
	): Promise<AIObjectResponse<z.infer<T>>> {
		return generateAIObject(this.configuration, objectOptions);
	}

	withConfiguration(
		configurationOverrides: Partial<AIConfiguration>,
	): AristocratsAI {
		return new AristocratsAI(
			mergeConfiguration(this.configuration, configurationOverrides),
		);
	}

	getConfiguration(): AIConfiguration {
		return { ...this.configuration };
	}
}

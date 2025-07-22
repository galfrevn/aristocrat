import { google } from '@ai-sdk/google';
import type { Lesson } from '@aristocrat/database/schema';
import { generateObject } from 'ai';
import { z } from 'zod';
import { RESEARCH_KEY_CONCEPTS_PROMPT } from '@/ai/concepts/prompt';

const researchKeyConceptsSchema = z.object({
	concepts: z.array(
		z.object({
			title: z.string(),
			searchParams: z.string(),
			researchedContent: z.string(),
			references: z.array(z.string()),
		}),
	),
});

export const researchKeyConceptsFn = async (lesson: Lesson, language: string) =>
	generateObject({
		model: google('gemini-2.5-flash', {
			useSearchGrounding: true,
		}),
		schema: researchKeyConceptsSchema,
		prompt: RESEARCH_KEY_CONCEPTS_PROMPT(lesson, language),
	});

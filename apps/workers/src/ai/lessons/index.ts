import { openai } from '@ai-sdk/openai';
import type { Chapter, Lesson } from '@aristocrat/database/schema';
import { generateObject } from 'ai';
import { z } from 'zod';
import { GENERATE_LESSONS_CONTENT_PROMPT } from '@/ai/lessons/prompt';
import type { TranscriptResponse } from '@/tools/transcripter';

const generateLessonsContentSchema = z.object({
	lessons: z.array(
		z.object({
			title: z.string(),
			content: z.string(),
			description: z.string(),
			keyConcepts: z
				.array(
					z.object({
						title: z.string(),
						searchParams: z.string(),
					}),
				)
				.default([]),
		}),
	),
});

export const generateLessonsContentFn = async (
	transcript: TranscriptResponse['transcript'],
	chapter: Chapter & { lessons: Array<Lesson> },
	language: string,
) =>
	generateObject({
		model: openai('gpt-4.1-mini'),
		schema: generateLessonsContentSchema,
		prompt: GENERATE_LESSONS_CONTENT_PROMPT(transcript, chapter, language),
	});

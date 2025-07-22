import { google } from '@ai-sdk/google';

import { generateObject } from 'ai';
import { z } from 'zod';

import { GENERATE_CHAPTERS_FROM_TRANSCRIPT_PROMPT } from '@/ai/chapters/prompt';

import type { TranscriptResponse } from '@/tools/transcripter';

const generateCourseChaptersFnSchema = z.object({
	chapters: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			lessons: z.array(
				z.object({
					title: z.string(),
					description: z.string(),
					startTime: z.string(),
					endTime: z.string(),
				}),
			),
		}),
	),
});

export const generateCourseChaptersFn = async (
	t: TranscriptResponse['transcript'],
	language: string,
) =>
	generateObject({
		model: google('gemini-2.5-flash'),
		schema: generateCourseChaptersFnSchema,
		prompt: GENERATE_CHAPTERS_FROM_TRANSCRIPT_PROMPT(t, language),
	});

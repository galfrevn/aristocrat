import { google } from '@ai-sdk/google';
import type { Course } from '@aristocrat/database/schema';
import { generateObject } from 'ai';
import { z } from 'zod';
import {
	CATEGORIZE_COURSE_PROMPT,
	DESCRIBE_COURSE_PROMPT,
} from '@/ai/categorization/prompt';

import type { TranscriptResponse } from '@/tools/transcripter';

const categorizeCourseSchema = z.object({
	category: z.string().describe('Main category for the course'),
	tags: z
		.array(z.string())
		.min(2)
		.max(5)
		.describe('Array of relevant tags for the course'),
});

export const categorizeCourseFn = async (
	transcript: TranscriptResponse['transcript'],
	course: Course,
	language: string,
) =>
	generateObject({
		model: google('gemini-2.5-flash'),
		schema: categorizeCourseSchema,
		prompt: CATEGORIZE_COURSE_PROMPT(transcript, course, language),
	});

const describeCourseSchema = z.object({
	description: z.string().describe('Description of the course'),
});

export const describeCourseFn = async (
	transcript: TranscriptResponse['transcript'],
	courseTitle: string,
	language: string,
) =>
	generateObject({
		model: google('gemini-2.5-flash'),
		schema: describeCourseSchema,
		prompt: DESCRIBE_COURSE_PROMPT(transcript, courseTitle, language),
	});

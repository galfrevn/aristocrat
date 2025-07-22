import { google } from '@ai-sdk/google';
import type { Course } from '@aristocrat/database/schema';
import { generateObject } from 'ai';
import { z } from 'zod';
import { GENERATE_ASSESSMENT_PROMPT } from '@/ai/assessment/prompt';
import type { TranscriptResponse } from '@/tools/transcripter';

const generateAssessmentSchema = z.object({
	assessments: z.array(
		z.object({
			question: z.string(),
			type: z.enum([
				'multiple_choice',
				'true_false',
				'fill_blank',
				'short_answer',
			]),
			options: z.array(z.string()).optional(),
			correctAnswer: z.string(),
			explanation: z.string().optional(),
			hint: z.string().optional(),
			points: z.number().default(1),
			passingScore: z.number().default(70),
			timeLimit: z.number().optional(),
		}),
	),
});

export const generateAssessmentFn = async (
	transcript: TranscriptResponse['transcript'],
	course: Course,
	language: string,
) =>
	generateObject({
		model: google('gemini-2.5-pro'),
		schema: generateAssessmentSchema,
		prompt: GENERATE_ASSESSMENT_PROMPT(transcript, course, language),
	});

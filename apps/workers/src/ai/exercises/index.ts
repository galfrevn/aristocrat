import { google } from '@ai-sdk/google';
import type { Lesson } from '@aristocrat/database/schema';
import { generateObject } from 'ai';
import { z } from 'zod';
import { GENERATE_EXERCISES_PROMPT } from '@/ai/exercises/prompt';
import type { TranscriptResponse } from '@/tools/transcripter';

const generateExercisesSchema = z.object({
	exercises: z.array(
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
		}),
	),
});

export const generateExercisesFn = async (
	transcript: TranscriptResponse['transcript'],
	lesson: Lesson,
	language: string,
) =>
	generateObject({
		model: google('gemini-2.5-pro'),
		schema: generateExercisesSchema,
		prompt: GENERATE_EXERCISES_PROMPT(transcript, lesson, language),
	});

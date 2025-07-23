import { google } from '@ai-sdk/google';
import type { Lesson } from '@aristocrat/database/schema';
import { generateObject } from 'ai';
import { z } from 'zod';
import { GENERATE_EXERCISES_PROMPT } from '@/ai/exercises/prompt';
import type { TranscriptResponse } from '@/tools/transcripter';

const generateExercisesSchema = z.object({
	exercises: z.array(
		z.object({
			title: z.string(),
			description: z.string().optional(),
			type: z.enum([
				'multiple_choice',
				'fill_blank',
				'code',
				'free_text',
				'drag_drop',
			]),
			question: z.string(),
			options: z
				.array(
					z.object({
						id: z.string(),
						text: z.string(),
						isCorrect: z.boolean().default(false),
					}),
				)
				.min(2)
				.max(5)
				.optional(),
			correctAnswer: z.string(),
			explanation: z.string(),
			validationRegex: z.string().optional(),
			codeTemplate: z
				.object({
					language: z.string(),
					template: z.string(),
				})
				.optional(),
			hints: z.array(z.string()).max(3).optional(),
		}),
	),
});

export const generateExercisesFn = async (lesson: Lesson, language: string) =>
	generateObject({
		model: google('gemini-2.5-pro'),
		schema: generateExercisesSchema,
		prompt: GENERATE_EXERCISES_PROMPT(lesson, language),
	});

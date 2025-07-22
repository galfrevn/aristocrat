import { google } from '@ai-sdk/google';

import { generateObject } from 'ai';
import { z } from 'zod';

import {
	EXPLAIN_INVALID_TRANSCRIPT_PROMPT,
	VALIDATE_TRANSCRIPT_PROMPT,
} from '@/ai/validate/prompt';

import type { TranscriptResponse } from '@/services/transcripter';

const validateTranscriptFnSchema = z.object({
	valid: z.boolean(),
});

export const validateTranscriptFn = async (
	t: TranscriptResponse['transcript'],
) =>
	generateObject({
		model: google('gemini-2.5-flash'),
		schema: validateTranscriptFnSchema,
		prompt: VALIDATE_TRANSCRIPT_PROMPT(t),
	});

const explainInvalidTranscriptFnSchema = z.object({
	reason: z.string(),
	category: z.string(),
});

export const explainInvalidTranscriptFn = async (
	t: TranscriptResponse['transcript'],
) =>
	generateObject({
		model: google('gemini-2.5-flash'),
		schema: explainInvalidTranscriptFnSchema,
		prompt: EXPLAIN_INVALID_TRANSCRIPT_PROMPT(t),
	});

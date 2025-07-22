import { logger, metadata, task } from '@trigger.dev/sdk/v3';
import {
	explainInvalidTranscriptFn,
	validateTranscriptFn,
} from '@/ai/validate';
import { STEP, VALIDATING_TRANSCRIPT } from '@/tools/steps';
import type { TranscriptResponse } from '@/tools/transcripter';

export const COURSE_VALIDATION_JOB_MAX_DURATION = 300;
export const COURSE_VALIDATION_JOB_ID = 'course:validation';
export const COURSE_VALIDATION_JOB_DESCRIPTION =
	'Validates a transcript to ensure it is valid and can be used to generate a course.';

type CourseValidationJobPayload = {
	transcript: TranscriptResponse['transcript'];
};

export const courseValidationJob = task({
	id: COURSE_VALIDATION_JOB_ID,
	maxDuration: COURSE_VALIDATION_JOB_MAX_DURATION,
	description: COURSE_VALIDATION_JOB_DESCRIPTION,
	run: async (payload: CourseValidationJobPayload) => {
		// Updating generation progress
		metadata.set(STEP, VALIDATING_TRANSCRIPT);
		logger.info('Validating transcript', {
			transcript: payload.transcript,
		});

		const {
			object: validateTranscriptFnResponse,
			usage: validateTranscriptFnUsage,
		} = await validateTranscriptFn(payload.transcript);

		logger.info('Validating transcript result', {
			isValid: validateTranscriptFnResponse.valid,
			usage: validateTranscriptFnUsage,
		});

		if (validateTranscriptFnResponse.valid) {
			return validateTranscriptFnResponse;
		}

		// If the transcript is not valid for course generation, let's explain why
		// We return the reason and end the task.
		// #TODO: Research how can we edit the videoId and regenerate the task.

		const {
			object: explainInvalidTranscriptFnResponse,
			usage: explainInvalidTranscriptFnUsage,
		} = await explainInvalidTranscriptFn(payload.transcript);

		logger.warn('Validating transcript found invalid content', {
			isValid: validateTranscriptFnResponse.valid,
			reason: explainInvalidTranscriptFnResponse.reason,
			category: explainInvalidTranscriptFnResponse.category,
			usage: explainInvalidTranscriptFnUsage,
		});

		return {
			...explainInvalidTranscriptFnResponse,
			valid: false,
		};
	},
});

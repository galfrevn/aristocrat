import { logger, metadata, task } from '@trigger.dev/sdk/v3';

import { generateCourseChaptersFn } from '@/ai/chapters';
import { GENERATING_CHAPTERS, STEP } from '@/tools/steps';
import type { TranscriptResponse } from '@/tools/transcripter';

export const COURSE_CHAPTERS_GENERATION_JOB_MAX_DURATION = 300;
export const COURSE_CHAPTERS_GENERATION_JOB_ID = 'course:chapters:generation';
export const COURSE_CHAPTERS_GENERATION_JOB_DESCRIPTION =
	'Generates chapters for a course from a transcript.';

type CourseChaptersGenerationJobPayload = {
	transcript: TranscriptResponse['transcript'];
	language: string;
};

export const courseChaptersGenerationJob = task({
	id: COURSE_CHAPTERS_GENERATION_JOB_ID,
	maxDuration: COURSE_CHAPTERS_GENERATION_JOB_MAX_DURATION,
	description: COURSE_CHAPTERS_GENERATION_JOB_DESCRIPTION,
	run: async (payload: CourseChaptersGenerationJobPayload) => {
		// Updating generation progress
		metadata.set(STEP, GENERATING_CHAPTERS);
		logger.info('Generating chapters', {
			transcript: payload.transcript,
		});

		const { object: generateCourseChaptersFnResponse } =
			await generateCourseChaptersFn(payload.transcript, payload.language);

		return generateCourseChaptersFnResponse;
	},
});

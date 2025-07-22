import { logger, metadata, task } from '@trigger.dev/sdk/v3';

import {
	prepareTranscriptForAi,
	TranscripterService,
} from '@/services/transcripter';

import { courseValidationJob } from '@/trigger/validate';

export const COURSE_GENERATION_JOB_MAX_DURATION = 300;
export const COURSE_GENERATION_JOB_ID = 'course:generation';
export const COURSE_GENERATION_JOB_DESCRIPTION =
	'Start processing a youtube video to generate a dynamic course using optimized AI techniques.';

type CourseGenerationJobPayload = {
	videoId: string;
	userId: string;
	courseId: string;
	language: string;
	difficulty: string;
};

export const courseGenerationJob = task({
	id: COURSE_GENERATION_JOB_ID,
	maxDuration: COURSE_GENERATION_JOB_MAX_DURATION,
	description: COURSE_GENERATION_JOB_DESCRIPTION,
	run: async (payload: CourseGenerationJobPayload, { ctx }) => {
		// AI Course generation starts here

		// Generation step #1
		// Read and translate the transcript into a structured format
		metadata.set('status', 'processing_transcript');
		logger.info('Staring transcript search', {
			videoId: payload.videoId,
		});

		const transcriptionService = new TranscripterService();
		const transcript = await transcriptionService.extractTranscript(
			payload.videoId,
			payload.language,
		);

		// Generation step #2
		// Checks if the transcript is valid for course generation
		// We want just transcript of tutorials or content that can be used to generate a course
		// If not, it will explain why and return the error.
		await courseValidationJob.triggerAndWait({
			transcript: prepareTranscriptForAi(transcript, { maximumSegments: 75 }),
		});

		// Generation step #3
		// Process the transcript and generate chapters.
	},
});

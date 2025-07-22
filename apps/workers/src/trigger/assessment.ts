import type { Course } from '@aristocrat/database/schema';
import { logger, metadata, task } from '@trigger.dev/sdk/v3';
import { generateAssessmentFn } from '@/ai/assessment';
import { GENERATING_ASSESSMENT, STEP } from '@/tools/steps';
import type { TranscriptResponse } from '@/tools/transcripter';

export const ASSESSMENT_GENERATION_JOB_MAX_DURATION = 180;
export const ASSESSMENT_GENERATION_JOB_ID = 'course:assessment:generation';
export const ASSESSMENT_GENERATION_JOB_DESCRIPTION =
	'Generates comprehensive final assessment for a course from transcript.';

type AssessmentGenerationJobPayload = {
	transcript: TranscriptResponse['transcript'];
	course: Course;
	language: string;
};

export const assessmentGenerationJob = task({
	id: ASSESSMENT_GENERATION_JOB_ID,
	maxDuration: ASSESSMENT_GENERATION_JOB_MAX_DURATION,
	description: ASSESSMENT_GENERATION_JOB_DESCRIPTION,
	run: async (payload: AssessmentGenerationJobPayload) => {
		metadata.set(STEP, GENERATING_ASSESSMENT);
		logger.info('Generating course assessment', {
			courseId: payload.course.id,
			courseTitle: payload.course.title,
		});

		const { object: generateAssessmentResponse } = await generateAssessmentFn(
			payload.transcript,
			payload.course,
			payload.language,
		);

		return generateAssessmentResponse;
	},
});

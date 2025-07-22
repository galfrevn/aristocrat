import type { Lesson } from '@aristocrat/database/schema';
import { logger, metadata, task } from '@trigger.dev/sdk/v3';
import { generateExercisesFn } from '@/ai/exercises';
import { GENERATING_EXERCISES, STEP } from '@/tools/steps';
import type { TranscriptResponse } from '@/tools/transcripter';

export const EXERCISES_GENERATION_JOB_MAX_DURATION = 120;
export const EXERCISES_GENERATION_JOB_ID = 'course:exercises:generation';
export const EXERCISES_GENERATION_JOB_DESCRIPTION =
	'Generates practice exercises for a lesson from transcript content.';

type ExercisesGenerationJobPayload = {
	transcript: TranscriptResponse['transcript'];
	lesson: Lesson;
	language: string;
};

export const exercisesGenerationJob = task({
	id: EXERCISES_GENERATION_JOB_ID,
	maxDuration: EXERCISES_GENERATION_JOB_MAX_DURATION,
	description: EXERCISES_GENERATION_JOB_DESCRIPTION,
	run: async (payload: ExercisesGenerationJobPayload) => {
		metadata.set(STEP, GENERATING_EXERCISES);
		logger.info('Generating exercises', {
			lessonId: payload.lesson.id,
			lessonTitle: payload.lesson.title,
		});

		const { object: generateExercisesResponse } = await generateExercisesFn(
			payload.transcript,
			payload.lesson,
			payload.language,
		);

		return generateExercisesResponse;
	},
});

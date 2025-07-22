import type { Chapter, Lesson } from '@aristocrat/database/schema';
import { logger, metadata, task } from '@trigger.dev/sdk/v3';
import { generateLessonsContentFn } from '@/ai/lessons';
import { GENERATING_LESSONS, STEP } from '@/tools/steps';
import type { TranscriptResponse } from '@/tools/transcripter';

export const LESSONS_GENERATION_JOB_MAX_DURATION = 180;
export const LESSONS_GENERATION_JOB_ID = 'course:lessons:generation';
export const LESSONS_GENERATION_JOB_DESCRIPTION =
	'Generates detailed lesson content from transcript and chapter structure.';

type LessonsGenerationJobPayload = {
	transcript: TranscriptResponse['transcript'];
	language: string;
	chapter: Chapter & { lessons: Array<Lesson> };
};

export const lessonsGenerationJob = task({
	id: LESSONS_GENERATION_JOB_ID,
	maxDuration: LESSONS_GENERATION_JOB_MAX_DURATION,
	description: LESSONS_GENERATION_JOB_DESCRIPTION,
	run: async (payload: LessonsGenerationJobPayload) => {
		metadata.set(STEP, GENERATING_LESSONS);
		logger.info('Generating lessons content', {
			chapterId: payload.chapter.id,
			lessonCount: payload.chapter.lessons.length,
		});

		const { object: generateLessonsContentResponse } =
			await generateLessonsContentFn(
				payload.transcript,
				payload.chapter,
				payload.language,
			);

		return generateLessonsContentResponse;
	},
});

import { CoursesRepository, database } from '@aristocrat/database';
import type { Course } from '@aristocrat/database/schema';
import { logger, metadata, task } from '@trigger.dev/sdk/v3';
import { categorizeCourseFn, describeCourseFn } from '@/ai/categorization';
import { CATEGORIZING_COURSE, DESCRIBING_COURSE, STEP } from '@/tools/steps';
import type { TranscriptResponse } from '@/tools/transcripter';

export const COURSE_CATEGORIZATION_JOB_MAX_DURATION = 60;
export const COURSE_CATEGORIZATION_JOB_ID = 'course:categorization';
export const COURSE_CATEGORIZATION_JOB_DESCRIPTION =
	'Categorize a course and generate relevant tags based on transcript content.';

type CourseCategorizationJobPayload = {
	transcript: TranscriptResponse['transcript'];
	course: Course;
	language: string;
};

export const courseCategorizationJob = task({
	id: COURSE_CATEGORIZATION_JOB_ID,
	maxDuration: COURSE_CATEGORIZATION_JOB_MAX_DURATION,
	description: COURSE_CATEGORIZATION_JOB_DESCRIPTION,
	run: async (payload: CourseCategorizationJobPayload) => {
		// Updating generation progress
		metadata.set(STEP, CATEGORIZING_COURSE);
		logger.info('Categorizing course', {
			courseId: payload.course.id,
			language: payload.language,
		});

		const {
			object: categorizeCourseFnResponse,
			usage: categorizeCourseFnUsage,
		} = await categorizeCourseFn(
			payload.transcript,
			payload.course,
			payload.language,
		);

		logger.info('Course categorization completed', {
			courseId: payload.course.id,
			category: categorizeCourseFnResponse.category,
			usage: categorizeCourseFnUsage,
		});

		const coursesRepository = new CoursesRepository(database);
		await coursesRepository.update(payload.course.id, {
			category: categorizeCourseFnResponse.category,
			tags: categorizeCourseFnResponse.tags,
		});

		return categorizeCourseFnResponse;
	},
});

export const COURSE_DESCRIPTION_JOB_MAX_DURATION = 60;
export const COURSE_DESCRIPTION_JOB_ID = 'course:description';
export const COURSE_DESCRIPTION_JOB_DESCRIPTION =
	'Generate a description for a course based on transcript content.';

type CourseDescriptionJobPayload = {
	transcript: TranscriptResponse['transcript'];
	course: Course;
	language: string;
};

export const describeCourseJob = task({
	id: COURSE_DESCRIPTION_JOB_ID,
	maxDuration: COURSE_DESCRIPTION_JOB_MAX_DURATION,
	description: COURSE_DESCRIPTION_JOB_DESCRIPTION,
	run: async (payload: CourseDescriptionJobPayload) => {
		// Updating generation progress
		metadata.set(STEP, DESCRIBING_COURSE);
		logger.info('Describing course', {
			courseId: payload.course.id,
			language: payload.language,
		});

		const { object: describeCourseFnResponse } = await describeCourseFn(
			payload.transcript,
			payload.course.title,
			payload.language,
		);

		const coursesRepository = new CoursesRepository(database);
		await coursesRepository.update(payload.course.id, {
			description: describeCourseFnResponse.description,
		});

		return describeCourseFnResponse;
	},
});

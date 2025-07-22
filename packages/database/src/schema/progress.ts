import { assessments } from '@/schema/assessments';
import { user } from '@/schema/auth';
import { chapters } from '@/schema/chapters';
import { courses } from '@/schema/courses';
import { exercises } from '@/schema/exercises';
import { lessons } from '@/schema/lessons';
import {
	boolean,
	index,
	integer,
	oneof,
	table,
	text,
	timestamp,
	unique,
	uuid,
} from '@/utils/pg';

export const PROGRESS_STATUS_NAME = 'progress_status';
export const progressStatus = oneof(PROGRESS_STATUS_NAME, [
	'not_started',
	'in_progress',
	'completed',
]);

// Course Progress
export const COURSE_PROGRESS_ID_IDX = 'course_progress_id_idx';
export const COURSE_PROGRESS_USER_ID_IDX = 'course_progress_user_id_idx';
export const COURSE_PROGRESS_USER_COURSE_IDX =
	'course_progress_user_course_idx';

export const COURSE_PROGRESS_TABLE_NAME = 'course_progress';
export const courseProgress = table(
	COURSE_PROGRESS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Progress
		status: progressStatus().notNull().default('not_started'),
		completionPercentage: integer('completion_percentage').default(0).notNull(),
		totalTimeSpent: integer('total_time_spent').default(0).notNull(), // in minutes

		// # Metadata
		startedAt: timestamp('started_at'),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		courseId: uuid('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(COURSE_PROGRESS_ID_IDX).on(table.id),
		index(COURSE_PROGRESS_USER_ID_IDX).on(table.userId),
		index(COURSE_PROGRESS_USER_COURSE_IDX).on(table.userId, table.courseId),
		unique('course_progress_user_course_unique').on(
			table.userId,
			table.courseId,
		), // User can only have one progress per course
	],
);

// Chapter Progress
export const CHAPTER_PROGRESS_ID_IDX = 'chapter_progress_id_idx';
export const CHAPTER_PROGRESS_USER_ID_IDX = 'chapter_progress_user_id_idx';
export const CHAPTER_PROGRESS_USER_CHAPTER_IDX =
	'chapter_progress_user_chapter_idx';

export const CHAPTER_PROGRESS_TABLE_NAME = 'chapter_progress';
export const chapterProgress = table(
	CHAPTER_PROGRESS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Progress
		status: progressStatus().notNull().default('not_started'),
		completionPercentage: integer('completion_percentage').default(0).notNull(),

		// # Metadata
		startedAt: timestamp('started_at'),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		chapterId: uuid('chapter_id')
			.notNull()
			.references(() => chapters.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(CHAPTER_PROGRESS_ID_IDX).on(table.id),
		index(CHAPTER_PROGRESS_USER_ID_IDX).on(table.userId),
		index(CHAPTER_PROGRESS_USER_CHAPTER_IDX).on(table.userId, table.chapterId),
		unique('chapter_progress_user_chapter_unique').on(
			table.userId,
			table.chapterId,
		),
	],
);

// Lesson Progress
export const LESSON_PROGRESS_ID_IDX = 'lesson_progress_id_idx';
export const LESSON_PROGRESS_USER_ID_IDX = 'lesson_progress_user_id_idx';
export const LESSON_PROGRESS_USER_LESSON_IDX =
	'lesson_progress_user_lesson_idx';

export const LESSON_PROGRESS_TABLE_NAME = 'lesson_progress';
export const lessonProgress = table(
	LESSON_PROGRESS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Progress
		status: progressStatus().notNull().default('not_started'),
		timeSpent: integer('time_spent').default(0).notNull(), // in minutes

		// # Metadata
		startedAt: timestamp('started_at'),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		lessonId: uuid('lesson_id')
			.notNull()
			.references(() => lessons.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(LESSON_PROGRESS_ID_IDX).on(table.id),
		index(LESSON_PROGRESS_USER_ID_IDX).on(table.userId),
		index(LESSON_PROGRESS_USER_LESSON_IDX).on(table.userId, table.lessonId),
		unique('lesson_progress_user_lesson_unique').on(
			table.userId,
			table.lessonId,
		),
	],
);

// Exercise Responses
export const EXERCISE_RESPONSE_ID_IDX = 'exercise_responses_id_idx';
export const EXERCISE_RESPONSE_USER_ID_IDX = 'exercise_responses_user_id_idx';
export const EXERCISE_RESPONSE_USER_EXERCISE_IDX =
	'exercise_responses_user_exercise_idx';

export const EXERCISE_RESPONSES_TABLE_NAME = 'exercise_responses';
export const exerciseResponses = table(
	EXERCISE_RESPONSES_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Response Data
		userAnswer: text('user_answer').notNull(),
		isCorrect: boolean('is_correct').notNull(),
		pointsEarned: integer('points_earned').default(0).notNull(),
		attempts: integer('attempts').default(1).notNull(),

		// # Metadata
		submittedAt: timestamp('submitted_at').defaultNow().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		exerciseId: uuid('exercise_id')
			.notNull()
			.references(() => exercises.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(EXERCISE_RESPONSE_ID_IDX).on(table.id),
		index(EXERCISE_RESPONSE_USER_ID_IDX).on(table.userId),
		index(EXERCISE_RESPONSE_USER_EXERCISE_IDX).on(
			table.userId,
			table.exerciseId,
		),
	],
);

// Assessment Responses
export const ASSESSMENT_RESPONSE_ID_IDX = 'assessment_responses_id_idx';
export const ASSESSMENT_RESPONSE_USER_ID_IDX =
	'assessment_responses_user_id_idx';
export const ASSESSMENT_RESPONSE_USER_ASSESSMENT_IDX =
	'assessment_responses_user_assessment_idx';

export const ASSESSMENT_RESPONSES_TABLE_NAME = 'assessment_responses';
export const assessmentResponses = table(
	ASSESSMENT_RESPONSES_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Response Data
		userAnswer: text('user_answer').notNull(),
		isCorrect: boolean('is_correct').notNull(),
		pointsEarned: integer('points_earned').default(0).notNull(),
		totalScore: integer('total_score').notNull(), // Total score for the assessment
		maxScore: integer('max_score').notNull(), // Maximum possible score
		passed: boolean('passed').notNull(), // Whether the user passed the assessment
		attempts: integer('attempts').default(1).notNull(),

		// # Metadata
		submittedAt: timestamp('submitted_at').defaultNow().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		assessmentId: uuid('assessment_id')
			.notNull()
			.references(() => assessments.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(ASSESSMENT_RESPONSE_ID_IDX).on(table.id),
		index(ASSESSMENT_RESPONSE_USER_ID_IDX).on(table.userId),
		index(ASSESSMENT_RESPONSE_USER_ASSESSMENT_IDX).on(
			table.userId,
			table.assessmentId,
		),
	],
);

export const tables = [
	'course_progress',
	'chapter_progress',
	'lesson_progress',
	'exercise_responses',
	'assessment_responses',
] as const;

export type CourseProgress = typeof courseProgress.$inferSelect;
export type InsertCourseProgress = typeof courseProgress.$inferInsert;
export type ChapterProgress = typeof chapterProgress.$inferSelect;
export type InsertChapterProgress = typeof chapterProgress.$inferInsert;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;
export type ExerciseResponse = typeof exerciseResponses.$inferSelect;
export type InsertExerciseResponse = typeof exerciseResponses.$inferInsert;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = typeof assessmentResponses.$inferInsert;

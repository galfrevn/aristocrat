import { relations, sql } from 'drizzle-orm';
import { user } from '@/schema/auth';
import {
	index,
	integer,
	oneof,
	table,
	text,
	timestamp,
	uuid,
} from '@/utils/pg';
import { chapters } from './chapters';

export const COURSE_DIFFICULTY_NAME = 'difficulty';
export const difficulty = oneof(COURSE_DIFFICULTY_NAME, [
	'easy',
	'medium',
	'hard',
]);

export const COURSE_ID_IDX = 'courses_id_idx';
export const COURSE_GENERATION_PROCESS_ID_IDX =
	'courses_generation_process_id_idx';
export const COURSE_YOUTUBE_VIDEO_ID_IDX = 'courses_youtube_video_id_idx';
export const COURSE_USER_ID_IDX = 'courses_user_id_idx';

export const COURSES_TABLE_NAME = 'courses';
export const courses = table(
	COURSES_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Processing
		youtubeVideoId: text('youtube_video_id').notNull(),
		generationProcessId: text('generation_process_id'),

		// # Metadata
		title: text('title').notNull(),
		thumbnail: text('thumbnail').notNull(),
		description: text('description'),
		estimatedDuration: integer('estimated_duration').default(0).notNull(),

		// # Customization
		difficulty: difficulty().notNull(),
		language: text('language').notNull(),

		// # Identification
		category: text('category'),
		tags: text('tags').array().notNull().default(sql`'{}'::text[]`),

		// # Relations
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),

		// # Timestamps
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => [
		index(COURSE_ID_IDX).on(table.id),
		index(COURSE_GENERATION_PROCESS_ID_IDX).on(table.generationProcessId),
		index(COURSE_YOUTUBE_VIDEO_ID_IDX).on(table.youtubeVideoId),
		index(COURSE_USER_ID_IDX).on(table.userId),
	],
);

export const tables = ['courses'] as const;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseRelations = relations(courses, ({ many, one }) => ({
	chapters: many(chapters),
	user: one(user, { fields: [courses.userId], references: [user.id] }),
}));

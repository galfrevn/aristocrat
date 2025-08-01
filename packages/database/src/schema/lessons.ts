import { relations, sql } from 'drizzle-orm';
import { jsonb } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { chapters } from '@/schema/chapters';
import {
	index,
	integer,
	oneof,
	table,
	text,
	timestamp,
	uuid,
} from '@/utils/pg';

export const LESSON_TYPE_NAME = 'lesson_type';
export const lessonType = oneof(LESSON_TYPE_NAME, [
	'video',
	'text',
	'interactive',
	'quiz',
]);

export const LESSON_ID_IDX = 'lessons_id_idx';
export const LESSON_CHAPTER_ID_IDX = 'lessons_chapter_id_idx';
export const LESSON_ORDER_IDX = 'lessons_order_idx';

export const LESSONS_TABLE_NAME = 'lessons';
export const lessons = table(
	LESSONS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Content
		title: text('title').notNull(),
		description: text('description'),
		content: text('content'),

		// # Key Concepts for AI Research
		keyConcepts: jsonb('key_concepts')
			.$type<
				Array<{
					title: string;
					searchParams: string;
					researchedContent?: string;
					references?: string[];
				}>
			>()
			.default([])
			.notNull(),

		// # Time (Important to match content with the actual video)
		startTime: text('start_time'),
		endTime: text('end_time'),

		// # Organization
		type: lessonType().notNull(),
		order: integer('order').notNull(),
		estimatedDuration: integer('estimated_duration').default(0).notNull(),

		// # Metadata
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		chapterId: uuid('chapter_id')
			.notNull()
			.references(() => chapters.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(LESSON_ID_IDX).on(table.id),
		index(LESSON_CHAPTER_ID_IDX).on(table.chapterId),
		index(LESSON_ORDER_IDX).on(table.chapterId, table.order),
	],
);

export const tables = ['lessons'] as const;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

export const lessonSchema = createSelectSchema(lessons);

export const lessonRelations = relations(lessons, ({ one }) => ({
	chapter: one(chapters, {
		fields: [lessons.chapterId],
		references: [chapters.id],
	}),
}));

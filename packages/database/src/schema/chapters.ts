import { relations } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { courses } from '@/schema/courses';
import { index, integer, table, text, timestamp, uuid } from '@/utils/pg';
import { lessons } from './lessons';

export const CHAPTER_ID_IDX = 'chapters_id_idx';
export const CHAPTER_COURSE_ID_IDX = 'chapters_course_id_idx';
export const CHAPTER_ORDER_IDX = 'chapters_order_idx';

export const CHAPTERS_TABLE_NAME = 'chapters';
export const chapters = table(
	CHAPTERS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Content
		title: text('title').notNull(),
		description: text('description'),

		// # Organization
		order: integer('order').notNull(),
		estimatedDuration: integer('estimated_duration').default(0).notNull(),

		// # Metadata
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		courseId: uuid('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(CHAPTER_ID_IDX).on(table.id),
		index(CHAPTER_COURSE_ID_IDX).on(table.courseId),
		index(CHAPTER_ORDER_IDX).on(table.courseId, table.order),
	],
);

export const tables = ['chapters'] as const;
export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;

export const chapterSchema = createSelectSchema(chapters);

export const chapterRelations = relations(chapters, ({ many, one }) => ({
	lessons: many(lessons),
	course: one(courses, {
		fields: [chapters.courseId],
		references: [courses.id],
	}),
}));

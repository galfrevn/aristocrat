import { sql } from 'drizzle-orm';
import { courses } from '@/schema/courses';
import { exerciseType } from '@/schema/exercises';
import { index, integer, table, text, timestamp, uuid } from '@/utils/pg';

export const ASSESSMENT_ID_IDX = 'assessments_id_idx';
export const ASSESSMENT_COURSE_ID_IDX = 'assessments_course_id_idx';
export const ASSESSMENT_ORDER_IDX = 'assessments_order_idx';

export const ASSESSMENTS_TABLE_NAME = 'assessments';
export const assessments = table(
	ASSESSMENTS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Content
		question: text('question').notNull(),
		explanation: text('explanation'),
		hint: text('hint'),

		// # Assessment Configuration
		type: exerciseType().notNull(), // Reuse the same exercise types
		options: text('options').array().notNull().default(sql`'{}'::text[]`), // For multiple choice, etc.
		correctAnswer: text('correct_answer').notNull(),
		points: integer('points').default(1).notNull(),

		// # Requirements
		passingScore: integer('passing_score').default(70).notNull(), // Percentage needed to pass
		timeLimit: integer('time_limit'), // Time limit in minutes (optional)

		// # Organization
		order: integer('order').notNull(),

		// # Metadata
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		courseId: uuid('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(ASSESSMENT_ID_IDX).on(table.id),
		index(ASSESSMENT_COURSE_ID_IDX).on(table.courseId),
		index(ASSESSMENT_ORDER_IDX).on(table.courseId, table.order),
	],
);

export const tables = ['assessments'] as const;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

import { sql } from 'drizzle-orm';
import { jsonb } from 'drizzle-orm/pg-core';
import { lessons } from '@/schema/lessons';
import {
	index,
	integer,
	oneof,
	table,
	text,
	timestamp,
	uuid,
} from '@/utils/pg';

export const EXERCISE_TYPE_NAME = 'exercise_type';
export const exerciseType = oneof(EXERCISE_TYPE_NAME, [
	'multiple_choice',
	'true_false',
	'fill_blank',
	'short_answer',
	'code',
	'drag_drop',
]);

export const EXERCISE_ID_IDX = 'exercises_id_idx';
export const EXERCISE_LESSON_ID_IDX = 'exercises_lesson_id_idx';
export const EXERCISE_ORDER_IDX = 'exercises_order_idx';

export const EXERCISES_TABLE_NAME = 'exercises';
export const exercises = table(
	EXERCISES_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		title: text('title').notNull(),
		description: text('description'),

		// # Content
		question: text('question').notNull(),
		explanation: text('explanation'),

		// # Exercise Configuration
		type: exerciseType().notNull(),
		hints: jsonb('hints').$type<string[]>(),
		options:
			jsonb('options').$type<
				Array<{
					id: string;
					text: string;
					isCorrect?: boolean;
				}>
			>(),

		correctAnswer: text('correct_answer').notNull(),
		points: integer('points').default(1).notNull(),

		// For FreeText, FillBlank and Code exercises
		validationRegex: text('validation_regex'),

		// For Code exercises
		codeTemplate: text('code_template'),

		// # Organization
		order: integer('order').notNull(),

		// # Metadata
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),

		// # Relations
		lessonId: uuid('lesson_id')
			.notNull()
			.references(() => lessons.id, { onDelete: 'cascade' }),
	},
	(table) => [
		index(EXERCISE_ID_IDX).on(table.id),
		index(EXERCISE_LESSON_ID_IDX).on(table.lessonId),
		index(EXERCISE_ORDER_IDX).on(table.lessonId, table.order),
	],
);

export const tables = ['exercises'] as const;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

import { user } from '@/schema/auth';
import { lessons } from '@/schema/lessons';
import { index, table, text, timestamp, uuid } from '@/utils/pg';

export const NOTE_ID_IDX = 'notes_id_idx';
export const NOTE_USER_ID_IDX = 'notes_user_id_idx';
export const NOTE_LESSON_ID_IDX = 'notes_lesson_id_idx';
export const NOTE_USER_LESSON_IDX = 'notes_user_lesson_idx';

export const NOTES_TABLE_NAME = 'notes';
export const notes = table(
	NOTES_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),

		// # Content
		content: text('content').notNull(),
		title: text('title'), // Optional title for the note

		// # Metadata
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
		index(NOTE_ID_IDX).on(table.id),
		index(NOTE_USER_ID_IDX).on(table.userId),
		index(NOTE_LESSON_ID_IDX).on(table.lessonId),
		index(NOTE_USER_LESSON_IDX).on(table.userId, table.lessonId), // Composite index for user's notes on specific lesson
	],
);

export const tables = ['notes'] as const;
export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

import { eq } from 'drizzle-orm';
import type { AristocratDatabase } from '@/index';
import { type InsertNote, type Note, notes } from '@/schema/notes';

export class NotesRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(noteId: string) {
		return this.database.query.notes.findFirst({
			where: (notes, { eq }) => eq(notes.id, noteId),
		});
	}

	async getByUserId(userId: string) {
		return this.database.query.notes.findMany({
			where: (notes, { eq }) => eq(notes.userId, userId),
			orderBy: (notes, { desc }) => [desc(notes.createdAt)],
		});
	}

	async getByLessonId(lessonId: string) {
		return this.database.query.notes.findMany({
			where: (notes, { eq }) => eq(notes.lessonId, lessonId),
			orderBy: (notes, { desc }) => [desc(notes.createdAt)],
		});
	}

	async getByUserAndLesson(userId: string, lessonId: string) {
		return this.database.query.notes.findMany({
			where: (notes, { eq, and }) =>
				and(eq(notes.userId, userId), eq(notes.lessonId, lessonId)),
			orderBy: (notes, { desc }) => [desc(notes.createdAt)],
		});
	}

	async insert(input: InsertNote) {
		const [note] = await this.database.insert(notes).values(input).returning();

		return note;
	}

	async update(noteId: string, input: Partial<InsertNote>) {
		const [note] = await this.database
			.update(notes)
			.set(input)
			.where(eq(notes.id, noteId))
			.returning();

		return note;
	}

	async delete(noteId: string) {
		const [note] = await this.database
			.delete(notes)
			.where(eq(notes.id, noteId))
			.returning();

		return note;
	}

	async exists(noteId: string) {
		const note = await this.database.query.notes.findFirst({
			where: (notes, { eq }) => eq(notes.id, noteId),
			columns: { id: true },
		});

		return !!note;
	}

	async searchByContent(userId: string, searchTerm: string) {
		return this.database.query.notes.findMany({
			where: (notes, { eq, ilike, and }) =>
				and(eq(notes.userId, userId), ilike(notes.content, `%${searchTerm}%`)),
			orderBy: (notes, { desc }) => [desc(notes.createdAt)],
		});
	}

	async countByUser(userId: string) {
		const userNotes = await this.database.query.notes.findMany({
			where: (notes, { eq }) => eq(notes.userId, userId),
			columns: { id: true },
		});

		return userNotes.length;
	}
}

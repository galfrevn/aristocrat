import type { AristocratDatabase } from '@/index';
import { type InsertLesson, type Lesson, lessons } from '@/schema/lessons';
import { equals } from '@/utils/query';

export class LessonsRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(lessonId: string) {
		return this.database.query.lessons.findFirst({
			where: (lessons, { eq }) => eq(lessons.id, lessonId),
		});
	}

	async getByChapterId(chapterId: string) {
		return this.database.query.lessons.findMany({
			where: (lessons, { eq }) => eq(lessons.chapterId, chapterId),
		});
	}

	async getByChapterIdOrdered(chapterId: string) {
		return this.database.query.lessons.findMany({
			where: (lessons, { eq }) => eq(lessons.chapterId, chapterId),
			orderBy: (lessons, { asc }) => [asc(lessons.order)],
		});
	}

	async getByType(type: 'video' | 'text' | 'interactive' | 'quiz') {
		return this.database.query.lessons.findMany({
			where: (lessons, { eq }) => eq(lessons.type, type),
		});
	}

	async insert(input: InsertLesson) {
		const [lesson] = await this.database
			.insert(lessons)
			.values(input)
			.returning();

		return lesson;
	}

	async update(lessonId: string, input: Partial<InsertLesson>) {
		const [lesson] = await this.database
			.update(lessons)
			.set(input)
			.where(equals(lessons.id, lessonId))
			.returning();

		return lesson;
	}

	async delete(lessonId: string) {
		const [lesson] = await this.database
			.delete(lessons)
			.where(equals(lessons.id, lessonId))
			.returning();

		return lesson;
	}

	async exists(lessonId: string) {
		const lesson = await this.database.query.lessons.findFirst({
			where: (lessons, { eq }) => eq(lessons.id, lessonId),
			columns: { id: true },
		});

		return !!lesson;
	}

	async getNextOrder(chapterId: string) {
		const lastLesson = await this.database.query.lessons.findFirst({
			where: (lessons, { eq }) => eq(lessons.chapterId, chapterId),
			orderBy: (lessons, { desc }) => [desc(lessons.order)],
			columns: { order: true },
		});

		return (lastLesson?.order ?? 0) + 1;
	}
}

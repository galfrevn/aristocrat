import { eq } from 'drizzle-orm';
import type { AristocratDatabase } from '@/index';
import { type Chapter, chapters, type InsertChapter } from '@/schema/chapters';

export class ChaptersRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(chapterId: string) {
		return this.database.query.chapters.findFirst({
			where: (chapters, { eq }) => eq(chapters.id, chapterId),
		});
	}

	async getByCourseId(courseId: string) {
		return this.database.query.chapters.findMany({
			where: (chapters, { eq }) => eq(chapters.courseId, courseId),
		});
	}

	async getByCourseIdOrdered(courseId: string) {
		return this.database.query.chapters.findMany({
			where: (chapters, { eq }) => eq(chapters.courseId, courseId),
			orderBy: (chapters, { asc }) => [asc(chapters.order)],
		});
	}

	async insert(input: InsertChapter) {
		const [chapter] = await this.database
			.insert(chapters)
			.values(input)
			.returning();

		return chapter;
	}

	async insertMany(input: InsertChapter[]) {
		const response = await this.database
			.insert(chapters)
			.values(input)
			.returning();

		return response;
	}

	async update(chapterId: string, input: Partial<InsertChapter>) {
		const [chapter] = await this.database
			.update(chapters)
			.set(input)
			.where(eq(chapters.id, chapterId))
			.returning();

		return chapter;
	}

	async delete(chapterId: string) {
		const [chapter] = await this.database
			.delete(chapters)
			.where(eq(chapters.id, chapterId))
			.returning();

		return chapter;
	}

	async exists(chapterId: string) {
		const chapter = await this.database.query.chapters.findFirst({
			where: (chapters, { eq }) => eq(chapters.id, chapterId),
			columns: { id: true },
		});

		return !!chapter;
	}

	async getNextOrder(courseId: string) {
		const lastChapter = await this.database.query.chapters.findFirst({
			where: (chapters, { eq }) => eq(chapters.courseId, courseId),
			orderBy: (chapters, { desc }) => [desc(chapters.order)],
			columns: { order: true },
		});

		return (lastChapter?.order ?? 0) + 1;
	}
}

import { eq } from 'drizzle-orm';
import type { AristocratDatabase } from '@/index';
import { courses, type InsertCourse } from '@/schema/courses';

export class CoursesRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(courseId: string) {
		return this.database.query.courses.findFirst({
			where: (courses, { eq }) => eq(courses.id, courseId),
		});
	}

	async getByYoutubeVideoId(youtubeVideoId: string) {
		return this.database.query.courses.findFirst({
			where: (courses, { eq }) => eq(courses.youtubeVideoId, youtubeVideoId),
		});
	}

	async getByGenerationProcessId(generationProcessId: string) {
		return this.database.query.courses.findFirst({
			where: (courses, { eq }) =>
				eq(courses.generationProcessId, generationProcessId),
		});
	}

	async getByUserId(userId: string) {
		return this.database.query.courses.findFirst({
			where: (courses, { eq }) => eq(courses.userId, userId),
		});
	}

	async insert(input: InsertCourse) {
		const [course] = await this.database
			.insert(courses)
			.values(input)
			.returning();

		return course;
	}

	async update(courseId: string, input: Partial<InsertCourse>) {
		const [course] = await this.database
			.update(courses)
			.set(input)
			.where(eq(courses.id, courseId))
			.returning();

		return course;
	}

	async delete(courseId: string) {
		const [course] = await this.database
			.delete(courses)
			.where(eq(courses.id, courseId))
			.returning();

		return course;
	}

	async exists(courseId: string) {
		return this.database.query.courses.findFirst({
			where: (courses, { eq }) => eq(courses.id, courseId),
		});
	}
}

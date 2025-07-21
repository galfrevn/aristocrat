import type { AristocratDatabase } from '@/index';
import {
	type AssessmentResponse,
	assessmentResponses,
	type ChapterProgress,
	type CourseProgress,
	chapterProgress,
	courseProgress,
	type ExerciseResponse,
	exerciseResponses,
	type InsertAssessmentResponse,
	type InsertChapterProgress,
	type InsertCourseProgress,
	type InsertExerciseResponse,
	type InsertLessonProgress,
	type LessonProgress,
	lessonProgress,
} from '@/schema/progress';
import { equals } from '@/utils/query';

export class ProgressRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	// Course Progress
	async getCourseProgress(progressId: string) {
		return this.database.query.courseProgress.findFirst({
			where: (courseProgress, { eq }) => eq(courseProgress.id, progressId),
		});
	}

	async getCourseProgressByUser(userId: string) {
		return this.database.query.courseProgress.findMany({
			where: (courseProgress, { eq }) => eq(courseProgress.userId, userId),
		});
	}

	async getCourseProgressByUserAndCourse(userId: string, courseId: string) {
		return this.database.query.courseProgress.findFirst({
			where: (courseProgress, { eq, and }) =>
				and(
					eq(courseProgress.userId, userId),
					eq(courseProgress.courseId, courseId),
				),
		});
	}

	async insertCourseProgress(input: InsertCourseProgress) {
		const [progress] = await this.database
			.insert(courseProgress)
			.values(input)
			.returning();

		return progress;
	}

	async updateCourseProgress(
		progressId: string,
		input: Partial<InsertCourseProgress>,
	) {
		const [progress] = await this.database
			.update(courseProgress)
			.set(input)
			.where(equals(courseProgress.id, progressId))
			.returning();

		return progress;
	}

	// Chapter Progress
	async getChapterProgress(progressId: string) {
		return this.database.query.chapterProgress.findFirst({
			where: (chapterProgress, { eq }) => eq(chapterProgress.id, progressId),
		});
	}

	async getChapterProgressByUser(userId: string) {
		return this.database.query.chapterProgress.findMany({
			where: (chapterProgress, { eq }) => eq(chapterProgress.userId, userId),
		});
	}

	async getChapterProgressByUserAndChapter(userId: string, chapterId: string) {
		return this.database.query.chapterProgress.findFirst({
			where: (chapterProgress, { eq, and }) =>
				and(
					eq(chapterProgress.userId, userId),
					eq(chapterProgress.chapterId, chapterId),
				),
		});
	}

	async insertChapterProgress(input: InsertChapterProgress) {
		const [progress] = await this.database
			.insert(chapterProgress)
			.values(input)
			.returning();

		return progress;
	}

	async updateChapterProgress(
		progressId: string,
		input: Partial<InsertChapterProgress>,
	) {
		const [progress] = await this.database
			.update(chapterProgress)
			.set(input)
			.where(equals(chapterProgress.id, progressId))
			.returning();

		return progress;
	}

	// Lesson Progress
	async getLessonProgress(progressId: string) {
		return this.database.query.lessonProgress.findFirst({
			where: (lessonProgress, { eq }) => eq(lessonProgress.id, progressId),
		});
	}

	async getLessonProgressByUser(userId: string) {
		return this.database.query.lessonProgress.findMany({
			where: (lessonProgress, { eq }) => eq(lessonProgress.userId, userId),
		});
	}

	async getLessonProgressByUserAndLesson(userId: string, lessonId: string) {
		return this.database.query.lessonProgress.findFirst({
			where: (lessonProgress, { eq, and }) =>
				and(
					eq(lessonProgress.userId, userId),
					eq(lessonProgress.lessonId, lessonId),
				),
		});
	}

	async insertLessonProgress(input: InsertLessonProgress) {
		const [progress] = await this.database
			.insert(lessonProgress)
			.values(input)
			.returning();

		return progress;
	}

	async updateLessonProgress(
		progressId: string,
		input: Partial<InsertLessonProgress>,
	) {
		const [progress] = await this.database
			.update(lessonProgress)
			.set(input)
			.where(equals(lessonProgress.id, progressId))
			.returning();

		return progress;
	}

	// Exercise Responses
	async getExerciseResponse(responseId: string) {
		return this.database.query.exerciseResponses.findFirst({
			where: (exerciseResponses, { eq }) =>
				eq(exerciseResponses.id, responseId),
		});
	}

	async getExerciseResponsesByUser(userId: string) {
		return this.database.query.exerciseResponses.findMany({
			where: (exerciseResponses, { eq }) =>
				eq(exerciseResponses.userId, userId),
		});
	}

	async getExerciseResponsesByUserAndExercise(
		userId: string,
		exerciseId: string,
	) {
		return this.database.query.exerciseResponses.findMany({
			where: (exerciseResponses, { eq, and }) =>
				and(
					eq(exerciseResponses.userId, userId),
					eq(exerciseResponses.exerciseId, exerciseId),
				),
			orderBy: (exerciseResponses, { desc }) => [
				desc(exerciseResponses.submittedAt),
			],
		});
	}

	async insertExerciseResponse(input: InsertExerciseResponse) {
		const [response] = await this.database
			.insert(exerciseResponses)
			.values(input)
			.returning();

		return response;
	}

	// Assessment Responses
	async getAssessmentResponse(responseId: string) {
		return this.database.query.assessmentResponses.findFirst({
			where: (assessmentResponses, { eq }) =>
				eq(assessmentResponses.id, responseId),
		});
	}

	async getAssessmentResponsesByUser(userId: string) {
		return this.database.query.assessmentResponses.findMany({
			where: (assessmentResponses, { eq }) =>
				eq(assessmentResponses.userId, userId),
		});
	}

	async getAssessmentResponsesByUserAndAssessment(
		userId: string,
		assessmentId: string,
	) {
		return this.database.query.assessmentResponses.findMany({
			where: (assessmentResponses, { eq, and }) =>
				and(
					eq(assessmentResponses.userId, userId),
					eq(assessmentResponses.assessmentId, assessmentId),
				),
			orderBy: (assessmentResponses, { desc }) => [
				desc(assessmentResponses.submittedAt),
			],
		});
	}

	async insertAssessmentResponse(input: InsertAssessmentResponse) {
		const [response] = await this.database
			.insert(assessmentResponses)
			.values(input)
			.returning();

		return response;
	}

	// Utility methods
	async getUserScoreByExercise(userId: string, exerciseId: string) {
		const responses = await this.getExerciseResponsesByUserAndExercise(
			userId,
			exerciseId,
		);
		return responses.length > 0 ? responses[0] : null; // Latest response
	}

	async getUserScoreByAssessment(userId: string, assessmentId: string) {
		const responses = await this.getAssessmentResponsesByUserAndAssessment(
			userId,
			assessmentId,
		);
		return responses.length > 0 ? responses[0] : null; // Latest response
	}
}

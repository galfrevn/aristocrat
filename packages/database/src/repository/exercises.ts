import type { AristocratDatabase } from '@/index';
import {
	type Exercise,
	exercises,
	type InsertExercise,
} from '@/schema/exercises';
import { equals } from '@/utils/query';

export class ExercisesRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(exerciseId: string) {
		return this.database.query.exercises.findFirst({
			where: (exercises, { eq }) => eq(exercises.id, exerciseId),
		});
	}

	async getByLessonId(lessonId: string) {
		return this.database.query.exercises.findMany({
			where: (exercises, { eq }) => eq(exercises.lessonId, lessonId),
		});
	}

	async getByLessonIdOrdered(lessonId: string) {
		return this.database.query.exercises.findMany({
			where: (exercises, { eq }) => eq(exercises.lessonId, lessonId),
			orderBy: (exercises, { asc }) => [asc(exercises.order)],
		});
	}

	async getByType(
		type:
			| 'multiple_choice'
			| 'true_false'
			| 'fill_blank'
			| 'short_answer'
			| 'code'
			| 'drag_drop',
	) {
		return this.database.query.exercises.findMany({
			where: (exercises, { eq }) => eq(exercises.type, type),
		});
	}

	async insert(input: InsertExercise) {
		const [exercise] = await this.database
			.insert(exercises)
			.values(input)
			.returning();

		return exercise;
	}

	async update(exerciseId: string, input: Partial<InsertExercise>) {
		const [exercise] = await this.database
			.update(exercises)
			.set(input)
			.where(equals(exercises.id, exerciseId))
			.returning();

		return exercise;
	}

	async delete(exerciseId: string) {
		const [exercise] = await this.database
			.delete(exercises)
			.where(equals(exercises.id, exerciseId))
			.returning();

		return exercise;
	}

	async exists(exerciseId: string) {
		const exercise = await this.database.query.exercises.findFirst({
			where: (exercises, { eq }) => eq(exercises.id, exerciseId),
			columns: { id: true },
		});

		return !!exercise;
	}

	async getNextOrder(lessonId: string) {
		const lastExercise = await this.database.query.exercises.findFirst({
			where: (exercises, { eq }) => eq(exercises.lessonId, lessonId),
			orderBy: (exercises, { desc }) => [desc(exercises.order)],
			columns: { order: true },
		});

		return (lastExercise?.order ?? 0) + 1;
	}

	async getTotalPointsByLesson(lessonId: string) {
		const exercises = await this.database.query.exercises.findMany({
			where: (exercises, { eq }) => eq(exercises.lessonId, lessonId),
			columns: { points: true },
		});

		return exercises.reduce((total, exercise) => total + exercise.points, 0);
	}
}

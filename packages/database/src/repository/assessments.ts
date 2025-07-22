import type { AristocratDatabase } from '@/index';
import {
	type Assessment,
	assessments,
	type InsertAssessment,
} from '@/schema/assessments';
import { equals } from '@/utils/query';

export class AssessmentsRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(assessmentId: string) {
		return this.database.query.assessments.findFirst({
			where: (assessments, { eq }) => eq(assessments.id, assessmentId),
		});
	}

	async getByCourseId(courseId: string) {
		return this.database.query.assessments.findMany({
			where: (assessments, { eq }) => eq(assessments.courseId, courseId),
		});
	}

	async getByCourseIdOrdered(courseId: string) {
		return this.database.query.assessments.findMany({
			where: (assessments, { eq }) => eq(assessments.courseId, courseId),
			orderBy: (assessments, { asc }) => [asc(assessments.order)],
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
		return this.database.query.assessments.findMany({
			where: (assessments, { eq }) => eq(assessments.type, type),
		});
	}

	async insert(input: InsertAssessment) {
		const [assessment] = await this.database
			.insert(assessments)
			.values(input)
			.returning();

		return assessment;
	}

	async update(assessmentId: string, input: Partial<InsertAssessment>) {
		const [assessment] = await this.database
			.update(assessments)
			.set(input)
			.where(equals(assessments.id, assessmentId))
			.returning();

		return assessment;
	}

	async delete(assessmentId: string) {
		const [assessment] = await this.database
			.delete(assessments)
			.where(equals(assessments.id, assessmentId))
			.returning();

		return assessment;
	}

	async exists(assessmentId: string) {
		const assessment = await this.database.query.assessments.findFirst({
			where: (assessments, { eq }) => eq(assessments.id, assessmentId),
			columns: { id: true },
		});

		return !!assessment;
	}

	async getNextOrder(courseId: string) {
		const lastAssessment = await this.database.query.assessments.findFirst({
			where: (assessments, { eq }) => eq(assessments.courseId, courseId),
			orderBy: (assessments, { desc }) => [desc(assessments.order)],
			columns: { order: true },
		});

		return (lastAssessment?.order ?? 0) + 1;
	}

	async getTotalPointsByCourse(courseId: string) {
		const assessments = await this.database.query.assessments.findMany({
			where: (assessments, { eq }) => eq(assessments.courseId, courseId),
			columns: { points: true },
		});

		return assessments.reduce(
			(total, assessment) => total + assessment.points,
			0,
		);
	}
}

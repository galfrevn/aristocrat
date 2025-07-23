import { database } from '@aristocrat/database';
import {
	ChaptersRepository,
	ProgressRepository,
} from '@aristocrat/database/repository';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '@/lib/trpc';

export const courseProgressRouter = router({
	get: protectedProcedure
		.input(z.object({ courseId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const progress =
				await progressRepository.getCourseProgressByUserAndCourse(
					ctx.session.user.id,
					input.courseId,
				);

			return progress || null;
		}),

	upsert: protectedProcedure
		.input(
			z.object({
				courseId: z.string().uuid(),
				status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
				completionPercentage: z.number().min(0).max(100).optional(),
				totalTimeSpent: z.number().min(0).optional(),
				completedAt: z.date().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const existingProgress =
				await progressRepository.getCourseProgressByUserAndCourse(
					ctx.session.user.id,
					input.courseId,
				);

			if (existingProgress) {
				return progressRepository.updateCourseProgress(existingProgress.id, {
					...input,
					updatedAt: new Date(),
					...(input.status === 'in_progress' &&
						!existingProgress.startedAt && {
							startedAt: new Date(),
						}),
					...(input.status === 'completed' && {
						completedAt: input.completedAt || new Date(),
					}),
				});
			}

			return progressRepository.insertCourseProgress({
				userId: ctx.session.user.id,
				courseId: input.courseId,
				status: input.status || 'not_started',
				completionPercentage: input.completionPercentage || 0,
				totalTimeSpent: input.totalTimeSpent || 0,
				...(input.status === 'in_progress' && { startedAt: new Date() }),
				...(input.status === 'completed' && {
					completedAt: input.completedAt || new Date(),
				}),
			});
		}),

	list: protectedProcedure.query(async ({ ctx }) => {
		const progressRepository = new ProgressRepository(database);
		const progressList = await progressRepository.getCourseProgressByUser(
			ctx.session.user.id,
		);
		return progressList || [];
	}),

	markCompleted: protectedProcedure
		.input(z.object({ courseId: z.string().uuid() }))
		.mutation(async ({ input, ctx }) => {
			// Verify all course requirements are met before allowing completion
			const canComplete = await validateCourseCompletion(
				ctx.session.user.id,
				input.courseId,
			);

			if (!canComplete.canComplete) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: canComplete.reason,
				});
			}

			const progressRepository = new ProgressRepository(database);
			const existingProgress =
				await progressRepository.getCourseProgressByUserAndCourse(
					ctx.session.user.id,
					input.courseId,
				);

			if (existingProgress) {
				return progressRepository.updateCourseProgress(existingProgress.id, {
					status: 'completed',
					completionPercentage: 100,
					completedAt: new Date(),
					updatedAt: new Date(),
				});
			}

			return progressRepository.insertCourseProgress({
				userId: ctx.session.user.id,
				courseId: input.courseId,
				status: 'completed',
				completionPercentage: 100,
				completedAt: new Date(),
			});
		}),
});

async function validateCourseCompletion(userId: string, courseId: string) {
	// Get all chapters for the course
	const chaptersRepository = new ChaptersRepository(database);
	const chapters = await chaptersRepository.getByCourseIdOrdered(courseId);

	if (chapters.length === 0) {
		return { canComplete: true };
	}

	// Check if all chapters are completed
	const progressRepository = new ProgressRepository(database);
	for (const chapter of chapters) {
		const chapterProgress =
			await progressRepository.getChapterProgressByUserAndChapter(
				userId,
				chapter.id,
			);

		if (!chapterProgress || chapterProgress.status !== 'completed') {
			return {
				canComplete: false,
				reason: `Chapter "${chapter.title}" must be completed first`,
			};
		}
	}

	return { canComplete: true };
}

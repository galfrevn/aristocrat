import { database } from '@aristocrat/database';
import {
	ChaptersRepository,
	LessonsRepository,
	ProgressRepository,
} from '@aristocrat/database/repository';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '@/lib/trpc';

export const chapterProgressRouter = router({
	get: protectedProcedure
		.input(z.object({ chapterId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const progress =
				await progressRepository.getChapterProgressByUserAndChapter(
					ctx.session.user.id,
					input.chapterId,
				);
			return progress || null;
		}),

	upsert: protectedProcedure
		.input(
			z.object({
				chapterId: z.string().uuid(),
				status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
				completionPercentage: z.number().min(0).max(100).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Validate progression rules before allowing chapter to be started
			const canAccess = await validateChapterAccess(
				ctx.session.user.id,
				input.chapterId,
			);

			if (!canAccess.canAccess) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: canAccess.reason,
				});
			}

			const progressRepository = new ProgressRepository(database);
			const existingProgress =
				await progressRepository.getChapterProgressByUserAndChapter(
					ctx.session.user.id,
					input.chapterId,
				);

			if (existingProgress) {
				return progressRepository.updateChapterProgress(existingProgress.id, {
					...input,
					updatedAt: new Date(),
					...(input.status === 'in_progress' &&
						!existingProgress.startedAt && {
							startedAt: new Date(),
						}),
					...(input.status === 'completed' && {
						completedAt: new Date(),
					}),
				});
			}

			return progressRepository.insertChapterProgress({
				userId: ctx.session.user.id,
				chapterId: input.chapterId,
				status: input.status || 'not_started',
				completionPercentage: input.completionPercentage || 0,
				...(input.status === 'in_progress' && { startedAt: new Date() }),
				...(input.status === 'completed' && { completedAt: new Date() }),
			});
		}),

	listByCourse: protectedProcedure
		.input(z.object({ courseId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const chaptersRepository = new ChaptersRepository(database);
			const progressRepository = new ProgressRepository(database);
			const chapters = await chaptersRepository.getByCourseIdOrdered(
				input.courseId,
			);
			const progressPromises = chapters.map((chapter) =>
				progressRepository.getChapterProgressByUserAndChapter(
					ctx.session.user.id,
					chapter.id,
				),
			);

			const progressResults = await Promise.all(progressPromises);

			return chapters.map((chapter, index) => ({
				...chapter,
				progress: progressResults[index] || null,
			}));
		}),

	markCompleted: protectedProcedure
		.input(z.object({ chapterId: z.string().uuid() }))
		.mutation(async ({ input, ctx }) => {
			// Verify all lessons in chapter are completed
			const canComplete = await validateChapterCompletion(
				ctx.session.user.id,
				input.chapterId,
			);

			if (!canComplete.canComplete) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: canComplete.reason,
				});
			}

			const progressRepository = new ProgressRepository(database);
			const existingProgress =
				await progressRepository.getChapterProgressByUserAndChapter(
					ctx.session.user.id,
					input.chapterId,
				);

			if (existingProgress) {
				return progressRepository.updateChapterProgress(existingProgress.id, {
					status: 'completed',
					completionPercentage: 100,
					completedAt: new Date(),
					updatedAt: new Date(),
				});
			}

			return progressRepository.insertChapterProgress({
				userId: ctx.session.user.id,
				chapterId: input.chapterId,
				status: 'completed',
				completionPercentage: 100,
				completedAt: new Date(),
			});
		}),
});

async function validateChapterAccess(userId: string, chapterId: string) {
	// Get chapter details
	const chaptersRepository = new ChaptersRepository(database);
	const chapter = await chaptersRepository.get(chapterId);
	if (!chapter) {
		return { canAccess: false, reason: 'Chapter not found' };
	}

	// Get all chapters in the course ordered by their order
	const chapters = await chaptersRepository.getByCourseIdOrdered(
		chapter.courseId,
	);
	const currentChapterIndex = chapters.findIndex((c) => c.id === chapterId);

	if (currentChapterIndex === -1) {
		return { canAccess: false, reason: 'Chapter not found in course' };
	}

	// First chapter is always accessible
	if (currentChapterIndex === 0) {
		return { canAccess: true };
	}

	// Check if previous chapter is completed
	const previousChapter = chapters[currentChapterIndex - 1];
	const progressRepository = new ProgressRepository(database);
	const previousProgress =
		await progressRepository.getChapterProgressByUserAndChapter(
			userId,
			previousChapter.id,
		);

	if (!previousProgress || previousProgress.status !== 'completed') {
		return {
			canAccess: false,
			reason: `Previous chapter "${previousChapter.title}" must be completed first`,
		};
	}

	return { canAccess: true };
}

async function validateChapterCompletion(userId: string, chapterId: string) {
	// Get all lessons for the chapter
	const lessonsRepository = new LessonsRepository(database);
	const lessons = await lessonsRepository.getByChapterIdOrdered(chapterId);

	if (lessons.length === 0) {
		return { canComplete: true };
	}

	// Check if all lessons are completed
	const progressRepository = new ProgressRepository(database);
	for (const lesson of lessons) {
		const lessonProgress =
			await progressRepository.getLessonProgressByUserAndLesson(
				userId,
				lesson.id,
			);

		if (!lessonProgress || lessonProgress.status !== 'completed') {
			return {
				canComplete: false,
				reason: `Lesson "${lesson.title}" must be completed first`,
			};
		}
	}

	return { canComplete: true };
}

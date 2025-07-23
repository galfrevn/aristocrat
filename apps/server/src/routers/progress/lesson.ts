import { database } from '@aristocrat/database';
import {
	ExercisesRepository,
	LessonsRepository,
	ProgressRepository,
} from '@aristocrat/database/repository';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '@/lib/trpc';

export const lessonProgressRouter = router({
	get: protectedProcedure
		.input(z.object({ lessonId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const progress =
				await progressRepository.getLessonProgressByUserAndLesson(
					ctx.session.user.id,
					input.lessonId,
				);
			return progress || null;
		}),

	upsert: protectedProcedure
		.input(
			z.object({
				lessonId: z.string().uuid(),
				status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
				timeSpent: z.number().min(0).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Validate progression rules before allowing lesson to be started
			const canAccess = await validateLessonAccess(
				ctx.session.user.id,
				input.lessonId,
			);

			if (!canAccess.canAccess) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: canAccess.reason,
				});
			}

			const progressRepository = new ProgressRepository(database);
			const existingProgress =
				await progressRepository.getLessonProgressByUserAndLesson(
					ctx.session.user.id,
					input.lessonId,
				);

			if (existingProgress) {
				return progressRepository.updateLessonProgress(existingProgress.id, {
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

			return progressRepository.insertLessonProgress({
				userId: ctx.session.user.id,
				lessonId: input.lessonId,
				status: input.status || 'not_started',
				timeSpent: input.timeSpent || 0,
				...(input.status === 'in_progress' && { startedAt: new Date() }),
				...(input.status === 'completed' && { completedAt: new Date() }),
			});
		}),

	listByChapter: protectedProcedure
		.input(z.object({ chapterId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const lessonsRepository = new LessonsRepository(database);
			const progressRepository = new ProgressRepository(database);
			const lessons = await lessonsRepository.getByChapterIdOrdered(
				input.chapterId,
			);
			const progressPromises = lessons.map((lesson) =>
				progressRepository.getLessonProgressByUserAndLesson(
					ctx.session.user.id,
					lesson.id,
				),
			);

			const progressResults = await Promise.all(progressPromises);

			return lessons.map((lesson, index) => ({
				...lesson,
				progress: progressResults[index] || null,
			}));
		}),

	markCompleted: protectedProcedure
		.input(z.object({ lessonId: z.string().uuid() }))
		.mutation(async ({ input, ctx }) => {
			// Verify all exercises in lesson are completed
			const canComplete = await validateLessonCompletion(
				ctx.session.user.id,
				input.lessonId,
			);

			if (!canComplete.canComplete) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: canComplete.reason,
				});
			}

			const progressRepository = new ProgressRepository(database);
			const existingProgress =
				await progressRepository.getLessonProgressByUserAndLesson(
					ctx.session.user.id,
					input.lessonId,
				);

			if (existingProgress) {
				return progressRepository.updateLessonProgress(existingProgress.id, {
					status: 'completed',
					completedAt: new Date(),
					updatedAt: new Date(),
				});
			}

			return progressRepository.insertLessonProgress({
				userId: ctx.session.user.id,
				lessonId: input.lessonId,
				status: 'completed',
				completedAt: new Date(),
			});
		}),

	canAccess: protectedProcedure
		.input(z.object({ lessonId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const result = await validateLessonAccess(
				ctx.session.user.id,
				input.lessonId,
			);
			return result || null;
		}),
});

async function validateLessonAccess(userId: string, lessonId: string) {
	// Get lesson details
	const lessonsRepository = new LessonsRepository(database);
	const lesson = await lessonsRepository.get(lessonId);
	if (!lesson) {
		return { canAccess: false, reason: 'Lesson not found' };
	}

	// Get all lessons in the chapter ordered by their order
	const lessons = await lessonsRepository.getByChapterIdOrdered(
		lesson.chapterId,
	);
	const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);

	if (currentLessonIndex === -1) {
		return { canAccess: false, reason: 'Lesson not found in chapter' };
	}

	// First lesson is always accessible
	if (currentLessonIndex === 0) {
		return { canAccess: true };
	}

	// Check if previous lesson is completed
	const previousLesson = lessons[currentLessonIndex - 1];
	const progressRepository = new ProgressRepository(database);
	const previousProgress =
		await progressRepository.getLessonProgressByUserAndLesson(
			userId,
			previousLesson.id,
		);

	if (!previousProgress || previousProgress.status !== 'completed') {
		return {
			canAccess: false,
			reason: `Previous lesson "${previousLesson.title}" must be completed first`,
		};
	}

	return { canAccess: true };
}

async function validateLessonCompletion(userId: string, lessonId: string) {
	// Get all exercises for the lesson
	const exercisesRepository = new ExercisesRepository(database);
	const exercises = await exercisesRepository.getByLessonIdOrdered(lessonId);

	if (exercises.length === 0) {
		return { canComplete: true };
	}

	// Check if all exercises have correct responses
	const progressRepository = new ProgressRepository(database);
	for (const exercise of exercises) {
		const responses =
			await progressRepository.getExerciseResponsesByUserAndExercise(
				userId,
				exercise.id,
			);

		// Check if user has at least one correct response for this exercise
		const hasCorrectResponse = responses.some((response) => response.isCorrect);

		if (!hasCorrectResponse) {
			return {
				canComplete: false,
				reason: `Exercise "${exercise.question}" must be completed correctly first`,
			};
		}
	}

	return { canComplete: true };
}

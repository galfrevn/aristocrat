import { database } from '@aristocrat/database';
import {
	ExercisesRepository,
	ProgressRepository,
} from '@aristocrat/database/repository';
import { z } from 'zod';
import { protectedProcedure, router } from '@/lib/trpc';

export const exerciseResponseRouter = router({
	get: protectedProcedure
		.input(z.object({ exerciseId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const responses =
				await progressRepository.getExerciseResponsesByUserAndExercise(
					ctx.session.user.id,
					input.exerciseId,
				);
			return responses || [];
		}),

	getLatest: protectedProcedure
		.input(z.object({ exerciseId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const responses =
				await progressRepository.getExerciseResponsesByUserAndExercise(
					ctx.session.user.id,
					input.exerciseId,
				);
			return responses && responses.length > 0 ? responses[0] : null;
		}),

	submit: protectedProcedure
		.input(
			z.object({
				exerciseId: z.string().uuid(),
				userAnswer: z.string(),
				isCorrect: z.boolean(),
				pointsEarned: z.number().min(0).optional().default(0),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Get previous attempts for this exercise
			const progressRepository = new ProgressRepository(database);
			const previousResponses =
				await progressRepository.getExerciseResponsesByUserAndExercise(
					ctx.session.user.id,
					input.exerciseId,
				);

			const attempts = previousResponses.length + 1;

			const response = await progressRepository.insertExerciseResponse({
				userId: ctx.session.user.id,
				exerciseId: input.exerciseId,
				userAnswer: input.userAnswer,
				isCorrect: input.isCorrect,
				pointsEarned: input.pointsEarned,
				attempts,
			});

			// If this is a correct answer, check if all exercises in the lesson are now complete
			if (input.isCorrect) {
				const exercisesRepository = new ExercisesRepository(database);
				const exercise = await exercisesRepository.get(input.exerciseId);
				if (exercise) {
					const canCompletLesson = await validateLessonCompletion(
						ctx.session.user.id,
						exercise.lessonId,
					);

					// Auto-complete lesson if all exercises are done
					if (canCompletLesson.canComplete) {
						const existingProgress =
							await progressRepository.getLessonProgressByUserAndLesson(
								ctx.session.user.id,
								exercise.lessonId,
							);

						if (existingProgress && existingProgress.status !== 'completed') {
							await progressRepository.updateLessonProgress(
								existingProgress.id,
								{
									status: 'completed',
									completedAt: new Date(),
									updatedAt: new Date(),
								},
							);
						} else if (!existingProgress) {
							await progressRepository.insertLessonProgress({
								userId: ctx.session.user.id,
								lessonId: exercise.lessonId,
								status: 'completed',
								completedAt: new Date(),
							});
						}
					}
				}
			}

			return response;
		}),

	list: protectedProcedure.query(async ({ ctx }) => {
		const progressRepository = new ProgressRepository(database);
		const responses = await progressRepository.getExerciseResponsesByUser(
			ctx.session.user.id,
		);
		return responses || [];
	}),

	getScore: protectedProcedure
		.input(z.object({ exerciseId: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const progressRepository = new ProgressRepository(database);
			const score = await progressRepository.getUserScoreByExercise(
				ctx.session.user.id,
				input.exerciseId,
			);
			return score || null;
		}),
});

// Helper function to check if all exercises in a lesson are completed
async function validateLessonCompletion(userId: string, lessonId: string) {
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

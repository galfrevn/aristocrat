import { database } from '@aristocrat/database';
import { z } from 'zod/v4';
import { protectedProcedure } from '@/lib/trpc';

const validation = z.object({
	lessonId: z.uuid('Invalid lesson ID format'),
});

export const exercises = protectedProcedure
	.input(validation)
	.query(async ({ input }) => {
		const response = await database.query.exercises.findMany({
			where: (fields, { eq }) => eq(fields.lessonId, input.lessonId),
		});

		return response;
	});

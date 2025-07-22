import { database } from '@aristocrat/database';
import { z } from 'zod/v4';
import { protectedProcedure } from '@/lib/trpc';

const validation = z.object({
	courseId: z.uuid('Invalid course ID format'),
});

export const content = protectedProcedure
	.input(validation)
	.query(async ({ input }) => {
		const response = await database.query.courses.findFirst({
			where: (fields, { eq }) => eq(fields.id, input.courseId),
			with: {
				chapters: {
					orderBy: (fields, { asc }) => asc(fields.order),
					with: {
						lessons: {
							orderBy: (fields, { asc }) => asc(fields.order),
						},
					},
				},
			},
		});

		return response;
	});

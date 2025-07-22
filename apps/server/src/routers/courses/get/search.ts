import { database } from '@aristocrat/database';
import { z } from 'zod';

import { protectedProcedure } from '@/lib/trpc';

const validation = z.object({
	query: z.string(),
});

export const search = protectedProcedure
	.input(validation)
	.query(async ({ ctx, input }) => {
		const response = await database.query.courses.findMany({
			with: { chapters: true },
			orderBy: (courses, { desc }) => desc(courses.createdAt),
			where: (courses, { and, ilike, eq }) =>
				and(
					eq(courses.userId, ctx.session.user.id),
					ilike(courses.title, `%${input.query}%`),
				),
		});

		return response;
	});

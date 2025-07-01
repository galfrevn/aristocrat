import { database } from '@aristocrat/database';
import { CoursesRepository } from '@aristocrat/database/repository';
import { z } from 'zod/v4';
import { protectedProcedure } from '@/lib/trpc';

const validation = z.object({
	courseId: z.uuid(),
});

export const one = protectedProcedure
	.input(validation)
	.query(async ({ input }) => {
		const repository = new CoursesRepository(database);
		return await repository.get(input.courseId);
	});

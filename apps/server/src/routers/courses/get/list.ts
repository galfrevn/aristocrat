import { database } from '@aristocrat/database';
import { courses } from '@aristocrat/database/schema';
import { equals } from '@aristocrat/database/utils';
import { protectedProcedure } from '@/lib/trpc';

export const list = protectedProcedure.query(async ({ ctx }) => {
	const response = await database
		.select()
		.from(courses)
		.where(equals(courses.userId, ctx.session.user.id));

	return response;
});

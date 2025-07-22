import { database } from '@aristocrat/database';
import { BannersRepository } from '@aristocrat/database/repository';
import { z } from 'zod';
import { protectedProcedure } from '@/lib/trpc';

export const disable = protectedProcedure
	.input(z.object({ id: z.string().uuid() }))
	.mutation(async ({ input }) => {
		const bannersRepository = new BannersRepository(database);

		const existingBanner = await bannersRepository.exists(input.id);
		if (!existingBanner) {
			throw new Error('Banner not found');
		}

		const response = await bannersRepository.disable(input.id);
		return response;
	});

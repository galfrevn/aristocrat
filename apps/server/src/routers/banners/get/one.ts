import { database } from '@aristocrat/database';
import { BannersRepository } from '@aristocrat/database/repository';
import { z } from 'zod';
import { protectedProcedure } from '@/lib/trpc';

export const one = protectedProcedure
	.input(z.object({ id: z.string().uuid() }))
	.query(async ({ input }) => {
		const bannersRepository = new BannersRepository(database);
		const response = await bannersRepository.get(input.id);

		if (!response) {
			throw new Error('Banner not found');
		}

		return response;
	});

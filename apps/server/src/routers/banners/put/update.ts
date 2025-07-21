import { database } from '@aristocrat/database';
import { BannersRepository } from '@aristocrat/database/repository';
import { z } from 'zod';
import { protectedProcedure } from '@/lib/trpc';

const updateBannerSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1).optional(),
	content: z.string().min(1).optional(),
	action: z.enum(['redirect', 'modal', 'dismiss']).optional(),
	actionUrl: z.string().url().optional(),
	isEnabled: z.boolean().optional(),
});

export const update = protectedProcedure
	.input(updateBannerSchema)
	.mutation(async ({ input }) => {
		const { id, ...updateData } = input;
		const bannersRepository = new BannersRepository(database);

		const existingBanner = await bannersRepository.exists(id);
		if (!existingBanner) {
			throw new Error('Banner not found');
		}

		const response = await bannersRepository.update(id, updateData);
		return response;
	});

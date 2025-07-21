import { database } from '@aristocrat/database';
import { BannersRepository } from '@aristocrat/database/repository';
import { z } from 'zod';
import { protectedProcedure } from '@/lib/trpc';

const createBannerSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	action: z.enum(['redirect', 'modal', 'dismiss']),
	actionUrl: z.string().url().optional(),
	isEnabled: z.boolean().default(false),
});

export const create = protectedProcedure
	.input(createBannerSchema)
	.mutation(async ({ input }) => {
		const bannersRepository = new BannersRepository(database);
		const response = await bannersRepository.insert(input);
		return response;
	});

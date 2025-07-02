import { database } from '@aristocrat/database';
import { BannersRepository } from '@aristocrat/database/repository';
import { protectedProcedure } from '@/lib/trpc';

export const list = protectedProcedure.query(async () => {
	const bannersRepository = new BannersRepository(database);
	const response = await bannersRepository.getAll();
	return response;
});

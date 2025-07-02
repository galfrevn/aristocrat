import { database } from '@aristocrat/database';
import { BannersRepository } from '@aristocrat/database/repository';
import { publicProcedure } from '@/lib/trpc';

export const enabled = publicProcedure.query(async () => {
	const bannersRepository = new BannersRepository(database);
	const response = await bannersRepository.getEnabled();
	return response;
});

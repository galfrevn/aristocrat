import type { AristocratDatabase } from '@/index';
import { banners, type InsertBanner } from '@/schema/banners';
import { equals } from '@/utils/query';

export class BannersRepository {
	constructor(private readonly database: AristocratDatabase) {
		this.database = database;
	}

	async get(bannerId: string) {
		return this.database.query.banners.findFirst({
			where: (banners, { eq }) => eq(banners.id, bannerId),
		});
	}

	async getEnabled() {
		return this.database.query.banners.findMany({
			where: (banners, { eq }) => eq(banners.isEnabled, true),
			orderBy: (banners, { desc }) => [desc(banners.createdAt)],
		});
	}

	async getAll() {
		return this.database.query.banners.findMany({
			orderBy: (banners, { desc }) => [desc(banners.createdAt)],
		});
	}

	async insert(input: InsertBanner) {
		const [banner] = await this.database
			.insert(banners)
			.values(input)
			.returning();

		return banner;
	}

	async update(bannerId: string, input: Partial<InsertBanner>) {
		const [banner] = await this.database
			.update(banners)
			.set({ ...input, updatedAt: new Date() })
			.where(equals(banners.id, bannerId))
			.returning();

		return banner;
	}

	async delete(bannerId: string) {
		const [banner] = await this.database
			.delete(banners)
			.where(equals(banners.id, bannerId))
			.returning();

		return banner;
	}

	async enable(bannerId: string) {
		return this.update(bannerId, { isEnabled: true });
	}

	async disable(bannerId: string) {
		return this.update(bannerId, { isEnabled: false });
	}

	async exists(bannerId: string) {
		return this.database.query.banners.findFirst({
			where: (banners, { eq }) => eq(banners.id, bannerId),
		});
	}
}

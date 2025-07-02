import {
	boolean,
	index,
	pgEnum,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { table } from '@/utils/pg';

export const BANNER_ACTION_NAME = 'banner_action';
export const bannerAction = pgEnum(BANNER_ACTION_NAME, [
	'redirect',
	'modal',
	'dismiss',
]);

export const BANNER_ID_IDX = 'banners_id_idx';
export const BANNER_ENABLED_IDX = 'banners_enabled_idx';

export const BANNERS_TABLE_NAME = 'banners';
export const banners = table(
	BANNERS_TABLE_NAME,
	{
		id: uuid('id').defaultRandom().primaryKey(),
		title: text('title').notNull(),
		content: text('content').notNull(),
		action: bannerAction().notNull(),
		actionUrl: text('action_url'),
		isEnabled: boolean('is_enabled').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => [
		index(BANNER_ID_IDX).on(table.id),
		index(BANNER_ENABLED_IDX).on(table.isEnabled),
	],
);

export const tables = ['banners'] as const;
export type Banner = typeof banners.$inferSelect;
export type InsertBanner = typeof banners.$inferInsert;

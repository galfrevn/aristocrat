import { drizzle } from 'drizzle-orm/node-postgres';

import { account, courses, session, user, verification } from './schema';

const schema = { account, user, session, verification, courses };

export const database = drizzle(process.env.DATABASE_URL || '', {
	schema,
});

export type AristocratDatabase = typeof database;

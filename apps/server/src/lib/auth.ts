import { database } from '@aristocrat/database';
import * as schema from '@aristocrat/database/schema';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
	database: drizzleAdapter(database, {
		provider: 'pg',
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ''],
	emailAndPassword: {
		enabled: true,
	},
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
});

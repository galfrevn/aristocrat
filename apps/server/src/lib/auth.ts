import { database } from '@aristocrat/database';
import * as schema from '@aristocrat/database/schema';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// Validate required environment variables
const requiredEnvVars = {
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

export const auth = betterAuth({
	database: drizzleAdapter(database, {
		provider: 'pg',
		schema: schema,
	}),
	trustedOrigins: [requiredEnvVars.CORS_ORIGIN],
	emailAndPassword: {
		enabled: true,
	},
	secret: requiredEnvVars.BETTER_AUTH_SECRET,
	baseURL: requiredEnvVars.BETTER_AUTH_URL,
});

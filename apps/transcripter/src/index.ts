import 'dotenv/config';

import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { aristocratTranscripterCoreRouter } from '@/routers/core';

const app = new Hono();

app.use(
	'/*',
	cors({
		origin: process.env.CORS_ORIGIN || '',
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);

app.route('/', aristocratTranscripterCoreRouter);

const SERVER_PORT = process.env.PORT || 3002;

console.log(
	`Transcript service running on port ${SERVER_PORT} with Bun and Hono`,
);

export default {
	port: SERVER_PORT,
	fetch: app.fetch,
};

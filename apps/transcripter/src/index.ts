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

export default {
	port: process.env.PORT,
	fetch: app.fetch,
};

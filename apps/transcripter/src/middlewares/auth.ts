import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

interface AuthPayload {
	userId: string;
	exp: number;
	iat: number;
}

export const authenticationMiddleware = async (c: Context, next: Next) => {
	try {
		console.log(process.env.NODE_ENV);
		if (process.env.NODE_ENV === 'development') {
			c.set('userId', 'dev-user');
			await next();
			return;
		}

		const authorization = c.req.header('Authorization');

		if (!authorization) {
			return c.json({ error: 'Authorization header required' }, 401);
		}

		const token = authorization.replace('Bearer ', '');

		if (!token) {
			return c.json({ error: 'Bearer token required' }, 401);
		}

		const secret = process.env.BETTER_AUTH_SECRET;

		if (!secret) {
			console.error('BETTER_AUTH_SECRET not configured');
			return c.json({ error: 'Authentication configuration error' }, 500);
		}

		const decoded = jwt.verify(token, secret) as AuthPayload;

		if (!decoded.userId) {
			return c.json({ error: 'Invalid token payload' }, 401);
		}

		c.set('userId', decoded.userId);

		await next();
	} catch (error) {
		console.error('Authentication error:', error);

		if (error instanceof jwt.JsonWebTokenError) {
			return c.json({ error: 'Invalid token' }, 401);
		}

		if (error instanceof jwt.TokenExpiredError) {
			return c.json({ error: 'Token expired' }, 401);
		}

		return c.json({ error: 'Authentication failed' }, 401);
	}
};

export const createAuthToken = (userId: string): string => {
	const secret = process.env.BETTER_AUTH_SECRET;
	if (!secret) {
		throw new Error('BETTER_AUTH_SECRET not configured');
	}

	return jwt.sign({ userId }, secret, {
		expiresIn: '1h',
		issuer: 'aicoursesgenerator-server',
		audience: 'aicoursesgenerator-transcripter',
	});
};

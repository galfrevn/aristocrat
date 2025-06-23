import { createAuthClient } from 'better-auth/react';

export const authenticationClientside = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

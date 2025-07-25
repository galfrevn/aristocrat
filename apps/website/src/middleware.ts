import type { Session } from 'better-auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const serverRoute = process.env.NEXT_PUBLIC_SERVER_URL;

	const response = await fetch(`${serverRoute}/api/auth/get-session`, {
		headers: {
			cookie: request.headers.get('cookie') || '',
		},
	});

	const session = (await response.json()) as Session;

	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};

import type { cookies } from 'next/headers';

export async function fetchEnabledBanners() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/trpc/banners.$get.enabled`,
			{ credentials: 'include', cache: 'no-store' },
		);

		if (!response.ok) {
			throw new Error('Failed to fetch banners');
		}

		const data = await response.json();
		return data.result?.data || [];
	} catch (error) {
		console.error('Error fetching enabled banners:', error);
		return [];
	}
}

export function getDismissedBannerIds(
	cookieStore: Awaited<ReturnType<typeof cookies>>,
): string[] {
	const dismissedCookie = cookieStore.get('dismissedBanners');
	return dismissedCookie ? JSON.parse(dismissedCookie.value) : [];
}

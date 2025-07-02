import { cookies } from 'next/headers';

import { AristocratNotificationsBannerClient } from '@/components/ui/banner/client';

interface AristocratNotificationsBannerProps {
	id: string;
}

// # TODO: Implement real TRPC
async function fetchEnabledBanners() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/trpc/banners.$get.enabled`,
		{ credentials: 'include' },
	);

	if (!response.ok) {
		throw new Error('Failed to fetch banners');
	}

	const data = await response.json();
	return data.result?.data || [];
}

function getDismissedBannerIds(
	cookieStore: Awaited<ReturnType<typeof cookies>>,
): string[] {
	const dismissedCookie = cookieStore.get('dismissedBanners');
	return dismissedCookie ? JSON.parse(dismissedCookie.value) : [];
}

export async function AristocratNotificationsBanner() {
	try {
		const enabledBanners = await fetchEnabledBanners();

		if (!enabledBanners.length) {
			return null;
		}

		const cookieStore = await cookies();
		const dismissedBannerIds = getDismissedBannerIds(cookieStore);

		const currentActiveBanner = enabledBanners.find(
			(banner: AristocratNotificationsBannerProps) =>
				!dismissedBannerIds.includes(banner.id),
		);

		if (!currentActiveBanner) {
			return null;
		}

		return <AristocratNotificationsBannerClient {...currentActiveBanner} />;
	} catch (error) {
		console.error('Failed to fetch banners:', error);
		return null;
	}
}

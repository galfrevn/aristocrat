import { cookies } from 'next/headers';

import { AristocratNotificationsBannerClient } from '@/components/ui/banner/client';
import {
	fetchEnabledBanners,
	getDismissedBannerIds,
} from '@/components/ui/banner/utils';

interface AristocratNotificationsBannerProps {
	id: string;
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

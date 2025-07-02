'use client';

import { useState } from 'react';
import { AristocratIcons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AristocratNotificationsBannerClientProps {
	id: string;
	title: string;
	content: string;
	action: 'redirect' | 'modal' | 'dismiss';
	actionUrl?: string | null;
	className?: string;
}

function addToDismissedCookies(bannerId: string): void {
	const cookies = document.cookie.split(';');
	const dismissedCookie = cookies.find((cookie) =>
		cookie.trim().startsWith('dismissedBanners='),
	);

	const existingDismissed: string[] = dismissedCookie
		? JSON.parse(dismissedCookie.split('=')[1])
		: [];

	const updatedDismissed = [...existingDismissed, bannerId];

	const expires = new Date();
	expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
	document.cookie = `dismissedBanners=${JSON.stringify(updatedDismissed)};expires=${expires.toUTCString()};path=/`;
}

export function AristocratNotificationsBannerClient({
	id,
	title,
	content,
	className,
}: AristocratNotificationsBannerClientProps) {
	const [isVisible, setIsVisible] = useState(true);

	const handleDismiss = (): void => {
		setIsVisible(false);
		addToDismissedCookies(id);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div
			className={cn(
				'dark relative bg-muted px-4 py-3 text-foreground',
				className,
			)}
		>
			<p className="flex justify-center text-sm">
				<button type="button" className="group appearance-none">
					<span className="me-1 tracking-tight">✨</span>
					{title}
					<span className="ms-2 text-xs opacity-70">{content}</span>
				</button>
			</p>
			<Button
				size="icon"
				variant="outline"
				className="absolute top-1 right-2 cursor-pointer rounded-full transition-colors duration-200"
				onClick={handleDismiss}
			>
				<AristocratIcons.XCircle />
			</Button>
		</div>
	);
}

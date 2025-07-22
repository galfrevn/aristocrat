import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ContentRootSkeleton() {
	const [sidebarSize, setSidebarSize] = useState('350');

	useEffect(() => {
		const savedSize = localStorage.getItem('course:content:sidebar:size');
		if (savedSize) {
			setSidebarSize(savedSize);
		}
	}, []);

	const computedSidebarWidth = `${sidebarSize}px`;
	const computedVideoWidth = `calc(100% - ${sidebarSize}px)`;

	return (
		<div>
			<header className="flex items-center justify-between bg-muted px-4 py-2 shadow">
				<Skeleton className="h-3 w-2/5" />
				<div className="flex items-center justify-center gap-2">
					<Skeleton className="h-9 w-[100px]" />
					<Skeleton className="size-9" />
				</div>
			</header>
			<div className="relative flex">
				<div className="flex flex-col" style={{ width: computedVideoWidth }}>
					<Skeleton className="h-[800px] w-full rounded-none bg-muted/50" />
					<section className="p-8">
						<Skeleton className="mb-4 h-6 w-2/3" />
						<Skeleton className="mb-4 h-4 w-1/3" />

						<Skeleton className="mt-10 mb-4 h-3 w-4/5" />
						<Skeleton className="mb-4 h-3 w-3/5" />
						<Skeleton className="mb-4 h-3 w-3/4" />
					</section>
				</div>

				<aside
					className="h-screen border-l p-2"
					style={{ width: computedSidebarWidth }}
				>
					<Skeleton className="h-9 w-full" />
				</aside>
			</div>
		</div>
	);
}

/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */

import { Skeleton } from '@/components/ui/skeleton';

export const AristocratCoursesListSkeleton = () => {
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
			{Array.from({ length: 3 }).map((_, index) => (
				<Skeleton
					key={index}
					className="h-[440px] w-full rounded-xl bg-muted"
				/>
			))}
		</div>
	);
};

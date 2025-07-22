'use client';

import { useQuery } from '@tanstack/react-query';

import { useDebounceValue } from 'usehooks-ts';
import { useAristocratCoursesSearch } from '@/app/dashboard/(dashboard)/courses/components/search/context';
import { AristocratCoursesListCard } from '@/app/dashboard/(dashboard)/courses/components/search/list/card';
import { AristocratCoursesListSkeleton } from '@/app/dashboard/(dashboard)/courses/components/search/list/skeleton';
import { trpc } from '@/utils/trpc';

export const AristocratCoursesList = () => {
	const { searchQuery } = useAristocratCoursesSearch();
	const [debouncedSearchQuery] = useDebounceValue(searchQuery, 300);

	const courses = useQuery({
		placeholderData: (prev) => prev,
		...trpc.courses.$get.search.queryOptions({
			query: debouncedSearchQuery,
		}),
	});

	if (courses.isLoading) {
		return <AristocratCoursesListSkeleton />;
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
			{courses.data?.map((item) => (
				// @ts-expect-error - TODO: fix this
				<AristocratCoursesListCard key={item.id} course={item} />
			))}
		</div>
	);
};

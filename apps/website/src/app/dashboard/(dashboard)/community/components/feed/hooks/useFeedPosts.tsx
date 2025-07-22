import { useInfiniteQuery } from '@tanstack/react-query';
import { feedPosts } from '../data';

const PAGE_SIZE = 3;

const fetchPosts = async ({ pageParam = 0 }) => {
	const start = pageParam * PAGE_SIZE;
	const end = start + PAGE_SIZE;
	const data = feedPosts.slice(start, end);
	const hasMore = end < feedPosts.length;
	return { data, nextPage: pageParam + 1, hasMore };
};

const useFeedPosts = () => {
	return useInfiniteQuery({
		queryKey: ['community-posts'],
		queryFn: fetchPosts,
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.nextPage : undefined,
		initialPageParam: 0,
	});
};

export default useFeedPosts;

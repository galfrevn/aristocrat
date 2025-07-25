import { QueryCache, QueryClient } from '@tanstack/react-query';

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { toast } from 'sonner';
import type { AristocratRouter } from '../../../server/dist/routers';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(error.message, {
				action: {
					label: 'retry',
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

const trpcClient = createTRPCClient<AristocratRouter>({
	links: [
		httpBatchLink({
			url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				});
			},
		}),
	],
});

export const trpc = createTRPCOptionsProxy<AristocratRouter>({
	client: trpcClient,
	queryClient,
});

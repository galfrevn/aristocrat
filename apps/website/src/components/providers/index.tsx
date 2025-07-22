'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { FontsProvider } from '@/components/providers/fonts';
import { NotificationsProvider } from '@/components/providers/notifications';
import { mono, sans, serif } from '@/styles/fonts';
import type { Layout } from '@/types/layout';
import { queryClient } from '@/utils/trpc';

interface LayoutProvidersProps extends Layout {}

export const LayoutProviders = ({ children }: LayoutProvidersProps) => (
	<FontsProvider fonts={{ mono, sans, serif }}>
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>{children}</NuqsAdapter>
			<ReactQueryDevtools />
		</QueryClientProvider>
		<NotificationsProvider richColors />
	</FontsProvider>
);

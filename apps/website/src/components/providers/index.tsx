'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FontsProvider } from '@/components/providers/fonts';
import { NotificationsProvider } from '@/components/providers/notifications';
import { ThemeProvider } from '@/components/providers/theme';
import { mono, sans, serif } from '@/styles/fonts';
import type { Layout } from '@/types/layout';
import { queryClient } from '@/utils/trpc';

interface LayoutProvidersProps extends Layout {}

export const LayoutProviders = ({ children }: LayoutProvidersProps) => (
	<FontsProvider fonts={{ mono, sans, serif }}>
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				{children}
				<ReactQueryDevtools />
			</QueryClientProvider>
			<NotificationsProvider richColors />
		</ThemeProvider>
	</FontsProvider>
);

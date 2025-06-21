import '@/styles/core.css';

import { LayoutProviders } from '@/components/providers';
import type { Layout } from '@/types/layout';

interface AristocratRootLayoutProps extends Layout {}

const AristocratRootLayout = ({ children }: AristocratRootLayoutProps) => (
	<html lang="en" suppressHydrationWarning>
		<LayoutProviders>{children}</LayoutProviders>
	</html>
);

export default AristocratRootLayout;

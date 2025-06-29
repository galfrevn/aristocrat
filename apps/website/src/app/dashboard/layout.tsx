import { AristocratNavigationHeader } from '@/components/navigation/header';

import { AristocratSidebar } from '@/components/navigation/sidebar';
import { SettingsPanelProvider } from '@/components/settings-panel';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Layout } from '@/types/layout';

interface AristocratDashboardLayoutProps extends Layout {}

const AristocratDashboardLayout = (props: AristocratDashboardLayoutProps) => {
	const { children } = props;

	return (
		<SidebarProvider>
			<AristocratSidebar />
			<SidebarInset className="group/sidebar-inset bg-sidebar">
				<AristocratNavigationHeader />
				<SettingsPanelProvider>
					<div className="aristocrat-main-content flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] transition-all duration-300 ease-in-out md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none">
						{children}
					</div>
				</SettingsPanelProvider>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default AristocratDashboardLayout;

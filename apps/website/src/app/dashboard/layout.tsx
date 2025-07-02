import { AristocratNavigationHeader } from '@/components/navigation/header';
import { AristocratSidebar } from '@/components/navigation/sidebar';
import { SettingsPanelProvider } from '@/components/settings-panel';
import { AristocratNotificationsBanner } from '@/components/ui/banner/server';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Layout } from '@/types/layout';

interface AristocratDashboardLayoutProps extends Layout {}

const AristocratDashboardLayout = async (
	props: AristocratDashboardLayoutProps,
) => {
	const { children } = props;

	return (
		<SidebarProvider>
			<AristocratSidebar />
			<SidebarInset className="group/sidebar-inset bg-sidebar">
				<div className="flex h-screen flex-col">
					<AristocratNotificationsBanner />
					<AristocratNavigationHeader />
					<SettingsPanelProvider>
						<div className="aristocrat-main-content flex flex-1 bg-[hsl(240_5%_92.16%)] transition-all duration-300 ease-in-out md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none">
							{children}
						</div>
					</SettingsPanelProvider>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default AristocratDashboardLayout;

'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { navigationConfiguration } from '@/components/navigation/configuration';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	type SidebarProps,
} from '@/components/ui/sidebar';

import { AristocratSidebarTeamSwitcher } from '@/components/navigation/sidebar/teams';

export const AristocratSidebar = (props: SidebarProps) => {
	const { sidebar } = navigationConfiguration;
	const { team, navigation } = sidebar;

	const pathname = usePathname();

	return (
		<Sidebar {...props} className="dark !border-none">
			<SidebarHeader>
				<AristocratSidebarTeamSwitcher team={team} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="text-sidebar-foreground/50 uppercase">
						Plataforma
					</SidebarGroupLabel>
					<SidebarGroupContent className="px-2">
						<SidebarMenu>
							{navigation.main.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className="group/menu-button h-9 gap-3 rounded-md font-medium data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] data-[active=true]:hover:bg-transparent [&>svg]:size-auto"
										isActive={pathname === item.url}
									>
										<Link href={item.url}>
											{item.icon && (
												<item.icon
													size={22}
													aria-hidden="true"
													className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
												/>
											)}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent className="px-2">
						<SidebarMenu>
							{navigation.secondary.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className="group/menu-button h-9 gap-3 rounded-md font-medium [&>svg]:size-auto"
										isActive={pathname === item.url}
									>
										<Link href={item.url}>
											{item.icon && (
												<item.icon
													size={22}
													aria-hidden="true"
													className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-primary"
												/>
											)}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
};

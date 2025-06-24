import Link from 'next/link';
import Image from 'next/image';

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { AristocratSidebarTeam } from '@/components/navigation/configuration';

interface AristocratSidebarTeamSwitcherProps {
	team: AristocratSidebarTeam;
}

export function AristocratSidebarTeamSwitcher(props: AristocratSidebarTeamSwitcherProps) {
	const { team } = props;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Link href="/dashboard">
					<SidebarMenuButton
						size="lg"
						className="cursor-pointer gap-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-auto"
					>
						<div className="relative flex aspect-square size-9 items-center justify-center overflow-hidden rounded-md bg-sidebar-primary p-2 text-sidebar-primary-foreground after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)]">
							<Image src={team.logo} width={36} height={36} alt={team.name} />
						</div>
						<div className="grid flex-1 text-left text-base leading-tight">
							<span className="truncate font-medium font-serif">
								{team.name}
							</span>
						</div>
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

import Link from 'next/link';

import {
	navigationConfiguration,
	type AristocratNavigationRoute,
} from '@/components/navigation/configuration';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { AristocratNavigationHeaderUser } from '@/components/navigation/header/user';

export const AristocratNavigationHeader = () => {
	const { header } = navigationConfiguration;

	return (
		<header className="dark before:-left-px relative flex h-16 shrink-0 items-center gap-2 bg-sidebar px-4 text-sidebar-foreground before:absolute before:inset-y-3 before:z-50 before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 md:px-6 lg:px-8">
			<SidebarTrigger className="-ms-2" />
			<div className="ml-auto flex items-center gap-8">
				<nav className="flex items-center font-medium text-sm max-sm:hidden">
					{header.map((item) => (
						<AristocratNavigationHeaderItem key={item.title} {...item} />
					))}
				</nav>
				<AristocratNavigationHeaderUser />
			</div>
		</header>
	);
};

export const AristocratNavigationHeaderItem = (
	item: AristocratNavigationRoute,
) => (
	<Link
		key={item.title}
		href={item.url}
		className="text-sidebar-foreground/50 transition-colors before:px-4 before:text-sidebar-foreground/30 before:content-['/'] first:before:hidden hover:text-sidebar-foreground/70 [&[aria-current]]:text-sidebar-foreground"
	>
		{item.title}
	</Link>
);

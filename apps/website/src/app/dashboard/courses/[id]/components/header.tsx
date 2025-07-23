import type { Course } from '@aristocrat/database/schema';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface ContentRootHeaderProps {
	title: Course['title'];
}

export function ContentRootHeader(props: ContentRootHeaderProps) {
	const { title } = props;

	return (
		<header className="flex items-center justify-between bg-muted px-4 py-2 shadow">
			<div className="flex items-center gap-4">
				<Link href="/dashboard">
					<div className="-mx-2 relative flex aspect-square size-10 items-center justify-center overflow-hidden rounded-lg p-2 text-sidebar-primary-foreground after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] dark:bg-sidebar-primary">
						<Image
							alt="Aristocrat Logo"
							src="/aristocrat/logo.avif"
							width={24}
							height={24}
							className="brightness-0 dark:brightness-100"
						/>
					</div>
				</Link>
				<div className="h-8 w-[1px] bg-muted-foreground/20" />
				<h5 className="font-medium">{title}</h5>
			</div>

			<div className="flex items-center justify-center gap-2">
				<Button variant="secondary">Compartir</Button>
				<Button size="icon">...</Button>
			</div>
		</header>
	);
}

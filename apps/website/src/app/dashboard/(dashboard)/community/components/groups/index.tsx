'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { AristocratIcons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AristocratCommunityGroupCard } from './components/group-card';

import { groups } from './data';

export const AristocratCommunityGroups = () => {
	return (
		<section aria-labelledby="grupos-estudio-titulo" className="w-full">
			<header className="flex items-center gap-2">
				<AristocratIcons.PersonGroups className="size-5" aria-hidden="true" />
				<h2 id="grupos-estudio-titulo" className="font-medium text-lg">
					Grupos de estudio
				</h2>
			</header>

			<ul className="flex flex-col gap-6 pt-6">
				{groups.length === 0 ? (
					<li className="py-8 text-center text-muted-foreground">
						No hay grupos disponibles por el momento.
					</li>
				) : (
					groups.slice(0, 2).map((group, index) => (
						<motion.li
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								type: 'spring',
								delay: index * 0.2,
								duration: 1,
							}}
							key={group.id}
						>
							<AristocratCommunityGroupCard {...group} />
						</motion.li>
					))
				)}
			</ul>

			<Button
				asChild
				variant="outline"
				size="lg"
				className="mt-6 w-full"
				aria-label="Ver todos los grupos de estudio"
			>
				<Link href="/dashboard/community/groups">Ver todos los grupos</Link>
			</Button>
		</section>
	);
};

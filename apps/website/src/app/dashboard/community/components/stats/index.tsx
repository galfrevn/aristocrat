'use client';

import { motion } from 'motion/react';
import { AristocratIcons } from '@/components/icons';
import { AristocratCommunityRulesSection } from './components/rules-section';
import { AristocratCommunityStatCard } from './components/stat-card';

import { stats } from './data';

export const AristocratCommunityStats = () => {
	return (
		<section
			aria-labelledby="estadisticas-globales-titulo"
			className="w-full space-y-6"
		>
			<header className="mb-4 flex items-center gap-2">
				<AristocratIcons.Community className="size-5" aria-hidden="true" />
				<h2 id="estadisticas-globales-titulo" className="font-medium text-lg">
					Estadísticas Globales
				</h2>
			</header>
			<section aria-label="Lista de estadísticas">
				<ul className="flex flex-col gap-4">
					{stats.length === 0 ? (
						<li className="py-8 text-center text-muted-foreground">
							No hay estadísticas disponibles por el momento.
						</li>
					) : (
						stats.map((stat, index) => (
							<motion.li
								key={stat.id ?? index}
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									type: 'spring',
									delay: index * 0.2,
									duration: 1,
								}}
							>
								<AristocratCommunityStatCard {...stat} />
							</motion.li>
						))
					)}
				</ul>
			</section>
			<motion.hr
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					type: 'spring',
					delay: 0.3,
					duration: 1,
				}}
			/>
			<AristocratCommunityRulesSection />
		</section>
	);
};

import type React from 'react';
import { Card } from '@/components/ui/card';
import { factsData } from '../data';

export const AristocratFunFactsCard = () => {
	return (
		<Card
			className="w-auto flex-1 bg-sidebar px-4 py-4 shadow-none sm:px-6 sm:pt-4 sm:pb-6"
			aria-labelledby="fun-facts-title"
		>
			<h2 id="fun-facts-title" className="font-semibold text-white text-xl">
				Datos Curiosos
			</h2>
			<ul
				className="flex h-full list-none flex-col justify-between gap-1"
				aria-label="Lista de datos curiosos sobre tiempo ahorrado"
			>
				{factsData.map((fact) => {
					return (
						<li
							key={`fun-fact-${fact.id}`}
							className="flex items-center gap-5 rounded-lg bg-accent px-4 py-3"
							aria-label={fact.ariaLabel}
						>
							<div className="text-primary" aria-hidden="true" role="img">
								{fact.icon}
							</div>
							<div>
								<h3 className="font-medium text-md text-primary">
									{fact.title}
								</h3>
								<p className="text-muted-foreground text-sm">{fact.subtitle}</p>
							</div>
						</li>
					);
				})}
			</ul>
		</Card>
	);
};

import type React from 'react';
import { AristocratIcons } from '@/components/icons';
import { Card } from '@/components/ui/card';

interface Fact {
	id: number;
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	ariaLabel: string;
}

const facts: Fact[] = [
	{
		id: 1,
		icon: <AristocratIcons.Film />,
		title: 'Has ahorrado el tiempo de',
		subtitle: '78 películas completas',
		ariaLabel: 'Tiempo ahorrado equivalente a 78 películas completas',
	},
	{
		id: 2,
		icon: <AristocratIcons.Cup />,
		title: 'Tiempo suficiente para',
		subtitle: '240 tazas de café',
		ariaLabel: 'Tiempo ahorrado equivalente a 240 tazas de café',
	},
	{
		id: 3,
		icon: <AristocratIcons.Plane />,
		title: 'Podrías haber volado',
		subtitle: '15 veces de Madrid a Nueva York',
		ariaLabel: 'Tiempo ahorrado equivalente a 15 vuelos de Madrid a Nueva York',
	},
];

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
				{facts.map((fact: Fact) => {
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

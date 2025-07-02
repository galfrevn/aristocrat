'use client';

import { AristocratIcons } from '@/components/icons';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const HELP_CARDS = [
	{
		icon: AristocratIcons.MessageCircle,
		title: 'Chat en Vivo',
		description: 'Habla con un agente ahora',
		status: 'En línea',
		iconColor: 'bg-blue-50 text-blue-600',
		statusColor: 'text-gray-600',
	},
	{
		icon: AristocratIcons.Book,
		title: 'Base de Conocimientos',
		description: 'Guías y tutoriales',
		status: '50+ artículos',
		iconColor: 'bg-green-50 text-green-600',
		statusColor: 'text-gray-600',
	},
	{
		icon: AristocratIcons.Mail,
		title: 'Email de Soporte',
		description: 'soporte@aristocrat.com',
		status: 'Respuesta en 24h',
		iconColor: 'bg-purple-50 text-purple-600',
		statusColor: 'text-gray-600',
	},
];

export function AristocratHelpCards() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{HELP_CARDS.map((card) => (
				<div key={card.title}>
					<Card className="shadow-none">
						<CardContent className="p-4">
							<div className="flex flex-col items-center space-y-3 text-center">
								<div className={cn('rounded-xl p-3', card.iconColor)}>
									<card.icon className="h-6 w-6" />
								</div>
								<div className="flex flex-col items-center gap-0.5">
									<h3 className="font-semibold leading-tight">{card.title}</h3>
									<p className="text-muted-foreground text-sm">
										{card.description}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			))}
		</div>
	);
}

import { AristocratIcons } from '@/components/icons';

import { Badge } from '@/components/ui/badge';

interface Fact {
	id: number;
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	ariaLabel: string;
}

interface Topic {
	id: number;
	topic: string;
	hours: number;
	courses: number;
}

export const metricsData = [
	{
		id: 1,
		isPrimary: true,
		icon: <AristocratIcons.Leaf />,
		title: 'Tiempo Ahorrado Total',
		value: 124,
		suffix: 'h',
		subtitle: 'Equivale a 78 peliculas o 3120 canciones',
		badge: (
			<Badge className="badge badge-success rounded-md bg-sidebar-foreground/70 px-2 py-1 text-background text-sm">
				¡Excelente!
			</Badge>
		),
	},
	{
		id: 2,
		isPrimary: false,
		icon: <AristocratIcons.Clock />,
		title: 'Horas de Estudio',
		value: 47,
		suffix: 'h',
		subtitle: '+12h desde la ultima semana',
		badge: (
			<span className="badge badge-success">
				<AristocratIcons.ArrowLeftUp />
			</span>
		),
	},
	{
		id: 3,
		isPrimary: false,
		icon: <AristocratIcons.StickyNote />,
		title: 'Notas Creadas',
		value: 89,
		subtitle: 'Promedio: 7 por curso',
		badge: (
			<span className="badge badge-success">
				<AristocratIcons.Stars />
			</span>
		),
	},
];

export const statsData = [
	{
		title: 'Cursos Completados',
		value: 12,
		icon: <AristocratIcons.Book />,
	},
	{
		title: 'Examenes Realizados',
		value: 24,
		icon: <AristocratIcons.Trophy />,
	},
	{
		title: 'Puntuacion Promedio',
		value: 87,
		prefix: '%',
		icon: <AristocratIcons.Focus />,
	},
];

export const factsData: Fact[] = [
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

export const topicsData: Topic[] = [
	{
		id: 1,
		topic: 'JavaScript',
		hours: 72,
		courses: 6,
	},
	{
		id: 2,
		topic: 'SQL',
		hours: 65,
		courses: 5,
	},
	{
		id: 3,
		topic: 'TypeScript',
		hours: 43,
		courses: 4,
	},
];

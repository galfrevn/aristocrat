import { AristocratIcons } from '@/components/icons';

export interface AristocratSidebarTeam {
	name: string;
	logo: `${string}/${string}`;
}

export interface AristocratNavigationRoute {
	title: string;
	url: string;
	icon: (typeof AristocratIcons)[keyof typeof AristocratIcons];
}

export interface AristocratNavigationConfiguration {
	header: Array<AristocratNavigationRoute>;
	sidebar: {
		team: AristocratSidebarTeam;
		navigation: {
			main: Array<AristocratNavigationRoute>;
			secondary: Array<AristocratNavigationRoute>;
		};
	};
}

const aristocratSidebarDefaultTeam: AristocratSidebarTeam = {
	name: 'Aristocrat',
	logo: '/aristocrat/logo.avif',
};

export const navigationConfiguration: AristocratNavigationConfiguration = {
	header: [
		{
			title: 'Comunidad',
			url: '/dashboard/community',
			icon: AristocratIcons.Community,
		},
	],
	sidebar: {
		team: aristocratSidebarDefaultTeam,
		navigation: {
			main: [
				{
					title: 'Dashboard',
					url: '/dashboard',
					icon: AristocratIcons.Dashboard,
				},
				{
					title: 'Cursos',
					url: '/dashboard/courses',
					icon: AristocratIcons.Courses,
				},
				{
					title: 'Asistentes',
					url: '#',
					icon: AristocratIcons.Attendees,
				},
				{
					title: 'Métricas',
					url: '#',
					icon: AristocratIcons.Metrics,
				},
				{
					title: 'Documentación',
					url: '#',
					icon: AristocratIcons.Documentation,
				},
			],
			secondary: [
				{
					title: 'Comunidad',
					url: '/dashboard/community',
					icon: AristocratIcons.Community,
				},
				{
					title: 'Centro de ayuda',
					url: '#',
					icon: AristocratIcons.HelpCenter,
				},
				{
					title: 'Configuración',
					url: '/dashboard/settings',
					icon: AristocratIcons.Settings,
				},
			],
		},
	},
};

import { usePathname } from 'next/navigation';

const aristocratNavigationRouteToBreadcrumbLabel = {
	dashboard: 'Dashboard',
	courses: 'Cursos',
	community: 'Comunidad',
	settings: 'Configuración',
};

type AristocratNavigationRoute =
	keyof typeof aristocratNavigationRouteToBreadcrumbLabel;

const getLabelFromSegment = (segment: AristocratNavigationRoute) =>
	aristocratNavigationRouteToBreadcrumbLabel[segment] ||
	segment.charAt(0).toUpperCase() + segment.slice(1);

export const useAristocratBreadcrumb = () => {
	const pathname = usePathname();
	const rawSegments = pathname
		.split('/')
		.filter(Boolean) as Array<AristocratNavigationRoute>;

	return rawSegments.map((segment, index) => ({
		label: getLabelFromSegment(segment),
		href: `/${rawSegments.slice(0, index + 1).join('/')}`,
		isLast: index === rawSegments.length - 1,
	}));
};

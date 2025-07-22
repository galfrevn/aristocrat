import { Filter, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AristocratCommunitySearch } from './search';

export const AristocratCommunityActions = () => {
	return (
		<nav
			className="flex flex-col items-center justify-between gap-4 md:flex-row"
			aria-label="Acciones de la comunidad"
		>
			<AristocratCommunitySearch />
			<div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
				<Button
					variant="outline"
					className="w-full gap-2 md:w-auto"
					size={'lg'}
					aria-label="Abrir filtros de publicaciones"
				>
					<Filter className="h-4 w-4" aria-hidden="true" />
					<span>Filtros</span>
				</Button>
				<Button
					className="w-full gap-2 md:w-auto"
					size={'lg'}
					aria-label="Crear nueva publicación"
				>
					<Plus className="h-4 w-4" aria-hidden="true" />
					<span>Crear publicación</span>
				</Button>
			</div>
		</nav>
	);
};

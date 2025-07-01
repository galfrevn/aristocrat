import { Filter, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const AristocratCommunityActions = () => {
	return (
		<div className="flex items-center gap-2">
			<Button variant="outline" className="gap-2">
				<Filter className="h-4 w-4" />
				Filtros
			</Button>
			<Button className="gap-2">
				<Plus className="h-4 w-4" />
				Crear publicación
			</Button>
		</div>
	);
};

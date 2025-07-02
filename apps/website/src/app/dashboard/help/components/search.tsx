import { AristocratIcons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search';

export function AristocratHelpSearch() {
	return (
		<div className="flex items-center gap-4">
			<SearchInput className="w-full" placeholder="Buscar ayuda..." />
			<Button variant="outline" className="gap-2">
				<AristocratIcons.Stars className="h-4 w-4" />
				Filtros
			</Button>
			<Button className="gap-2">Crear ticket de soporte</Button>
		</div>
	);
}

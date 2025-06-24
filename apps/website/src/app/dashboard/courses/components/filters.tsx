import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search';

import { AristocratIcons } from '@/components/icons';

export const AristocratCoursesFilters = () => {
	return (
		<div className="flex items-center justify-between">
			<SearchInput
				className="w-full max-w-xs"
				placeholder="Busca por título, autor o categoría"
			/>

			<Button variant="secondary">
				<AristocratIcons.Stars />
				Filtros
			</Button>
		</div>
	);
};

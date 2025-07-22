'use client';

import { AristocratIcons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAristocratCoursesSearch } from './context';

export const AristocratCoursesFilters = () => {
	const { searchQuery, setSearchQuery } = useAristocratCoursesSearch();

	return (
		<div className="flex items-center justify-between">
			<SearchInput
				className="w-full max-w-xs"
				placeholder="Busca por título, autor o categoría"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="secondary">
						<AristocratIcons.Stars />
						Filtros
					</Button>
				</TooltipTrigger>
				<TooltipContent className="dark">
					<p>Proximamente :)</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};

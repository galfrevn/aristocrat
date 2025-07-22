import { AristocratIcons } from '@/components/icons';

import { Input } from '@/components/ui/input';

export const AristocratCommunitySearch = () => {
	return (
		<search className="relative h-10 w-full lg:max-w-sm xl:max-w-lg">
			<label htmlFor="community-search" className="sr-only">
				Buscar en la comunidad
			</label>
			<AristocratIcons.Search
				className="-translate-y-2.5 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground"
				aria-hidden="true"
			/>
			<Input
				id="community-search"
				type="search"
				placeholder="Buscar en la comunidad..."
				className="h-lg pl-10"
				aria-label="Buscar en la comunidad"
			/>
		</search>
	);
};

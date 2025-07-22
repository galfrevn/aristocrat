import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export const AristocratCommunitySearch = () => {
	return (
		<div className="relative h-10 w-full lg:max-w-sm xl:max-w-lg">
			<Search className="-translate-y-2.5 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Buscar en la comunidad..."
				className="h-lg pl-10"
			/>
		</div>
	);
};

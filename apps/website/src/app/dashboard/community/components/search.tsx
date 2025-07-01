import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export const AristocratCommunitySearch = () => {
	return (
		<div className="relative">
			<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Buscar en la comunidad..."
				className="pl-10"
			/>
		</div>
	);
};

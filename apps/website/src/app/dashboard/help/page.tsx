import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';

import { AristocratHelpCards } from '@/app/dashboard/help/components/cards';
import { AristocratHelpSearch } from '@/app/dashboard/help/components/search';
import { AristocratHelpTabs } from '@/app/dashboard/help/components/tabs';

export default function HelpCenterPage() {
	return (
		<AristocratPageWrapper>
			<AristocratPageHeader
				title="Centro de Ayuda"
				description="Encuentra respuestas rápidas, crea tickets de soporte y accede a nuestra base de conocimientos"
			/>

			<div className="space-y-6">
				<AristocratHelpSearch />
				<AristocratHelpCards />
				<AristocratHelpTabs />
			</div>
		</AristocratPageWrapper>
	);
}

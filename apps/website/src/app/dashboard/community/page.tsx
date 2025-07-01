import { AristocratCommunityActions } from '@/app/dashboard/community/components/actions';
import { AristocratCommunityGrid } from '@/app/dashboard/community/components/grid';
import { AristocratCommunitySearch } from '@/app/dashboard/community/components/search';
import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';

const AristocratDashboardCommunityPage = () => (
	<AristocratPageWrapper action={<AristocratCommunityActions />}>
		<AristocratPageHeader
			title="Comunidad"
			description="Conecta con otros educadores y comparte experiencias de aprendizaje."
		/>

		<AristocratCommunitySearch />
		<AristocratCommunityGrid />
	</AristocratPageWrapper>
);

export default AristocratDashboardCommunityPage;

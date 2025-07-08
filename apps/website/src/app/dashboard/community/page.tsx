import { AristocratCommunityActions } from '@/app/dashboard/community/components/actions';
import { AristocratCommunityGrid } from '@/app/dashboard/community/components/grid';
import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';

import { AristocratCommunityFeed } from './components/feed';
import { AristocratCommunityGroups } from './components/groups';
import { AristocratCommunityStats } from './components/stats';

const AristocratDashboardCommunityPage = () => (
	<AristocratPageWrapper>
		<AristocratPageHeader
			title="Comunidad"
			description="Conecta con otros estudiantes y comparte experiencias de aprendizaje."
		/>

		<AristocratCommunityActions />

		<AristocratCommunityGrid>
			<AristocratCommunityFeed />
			<AristocratCommunityGroups />
			<AristocratCommunityStats />
		</AristocratCommunityGrid>
	</AristocratPageWrapper>
);

export default AristocratDashboardCommunityPage;

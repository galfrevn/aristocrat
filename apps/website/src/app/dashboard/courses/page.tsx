import { Button } from '@/components/ui/button';

import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';

import { AristocratCoursesFilters } from '@/app/dashboard/courses/components/filters';

const AristocratDashboardCoursesPage = () => (
	<AristocratPageWrapper
		action={<Button variant="secondary">Genera un nuevo curso</Button>}
	>
		<AristocratPageHeader
			title="Cursos"
			description="Organice sus cursos generados por AI aquí."
		/>

		<AristocratCoursesFilters />
	</AristocratPageWrapper>
);

export default AristocratDashboardCoursesPage;

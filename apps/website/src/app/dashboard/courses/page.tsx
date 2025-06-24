import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';

import { AristocratCoursesFilters } from '@/app/dashboard/courses/components/filters';
import { AristocratCourseGenerationProvider } from '@/app/dashboard/courses/components/generator/context';
import { AristocratCourseGenerationModal } from '@/app/dashboard/courses/components/generator/modal';
import { AristocratCourseGenerationTrigger } from '@/app/dashboard/courses/components/generator/trigger';

const AristocratDashboardCoursesPage = () => (
	<AristocratCourseGenerationProvider>
		<AristocratPageWrapper action={<AristocratCourseGenerationTrigger />}>
			<AristocratPageHeader
				title="Cursos"
				description="Organice sus cursos generados por AI aquí."
			/>

			<AristocratCoursesFilters />
		</AristocratPageWrapper>
		<AristocratCourseGenerationModal />
	</AristocratCourseGenerationProvider>
);

export default AristocratDashboardCoursesPage;

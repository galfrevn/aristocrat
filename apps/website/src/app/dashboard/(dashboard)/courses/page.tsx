import { AristocratPageHeader } from '@/app/dashboard/(dashboard)/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/(dashboard)/components/wrapper';

import { AristocratCourseGenerationProvider } from '@/app/dashboard/(dashboard)/courses/components/generator/context';
import { AristocratCourseGenerationModal } from '@/app/dashboard/(dashboard)/courses/components/generator/modal';
import { AristocratCourseGenerationTrigger } from '@/app/dashboard/(dashboard)/courses/components/generator/trigger';
import { AristocratCoursesSearchWrapper } from '@/app/dashboard/(dashboard)/courses/components/search/context';
import { AristocratCoursesFilters } from '@/app/dashboard/(dashboard)/courses/components/search/filters';
import { AristocratCoursesList } from '@/app/dashboard/(dashboard)/courses/components/search/list';

const AristocratDashboardCoursesPage = () => (
	<AristocratCourseGenerationProvider>
		<AristocratPageWrapper action={<AristocratCourseGenerationTrigger />}>
			<AristocratPageHeader
				title="Cursos"
				description="Organice sus cursos generados por AI aquí."
			/>

			<AristocratCoursesSearchWrapper>
				<AristocratCoursesFilters />
				<AristocratCoursesList />
			</AristocratCoursesSearchWrapper>
		</AristocratPageWrapper>
		<AristocratCourseGenerationModal />
	</AristocratCourseGenerationProvider>
);

export default AristocratDashboardCoursesPage;

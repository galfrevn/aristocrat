'use client';

import { useAristocratCourseGeneration } from '@/app/dashboard/courses/components/generator/context';
import { Button } from '@/components/ui/button';

export const AristocratCourseGenerationTrigger = () => {
	const { setIsModalOpen } = useAristocratCourseGeneration();

	return (
		<Button
			onClick={() => setIsModalOpen(true)}
			variant="secondary"
			className="cursor-pointer hover:bg-secondary/50"
		>
			Genera un nuevo curso
		</Button>
	);
};

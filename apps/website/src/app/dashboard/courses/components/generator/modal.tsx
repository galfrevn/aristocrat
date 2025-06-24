'use client';

import { useAristocratCourseGeneration } from '@/app/dashboard/courses/components/generator/context';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

export const AristocratCourseGenerationModal = () => {
	const { isModalOpen, setIsModalOpen } = useAristocratCourseGeneration();

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogContent className="font-sans">
				<DialogHeader>
					<DialogTitle>Generador</DialogTitle>
				</DialogHeader>
				Cuerpo
			</DialogContent>
		</Dialog>
	);
};

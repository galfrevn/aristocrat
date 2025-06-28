'use client';

import { useState } from 'react';
import { useAristocratCourseGeneration } from '@/app/dashboard/courses/components/generator/context';
import { AristocratCourseGenerationForm } from '@/app/dashboard/courses/components/generator/form';
import {
	type CourseGenerationStep,
	courseGenerationSteps,
} from '@/app/dashboard/courses/components/generator/steps';
import {
	SmoothModal,
	SmoothModalContent,
	SmoothModalDescription,
	SmoothModalHeader,
	SmoothModalTitle,
} from '@/components/ui/modal';

export const AristocratCourseGenerationModal = () => {
	const { isModalOpen, setIsModalOpen } = useAristocratCourseGeneration();
	const [currentStep, setCurrentStep] = useState<CourseGenerationStep>(
		courseGenerationSteps[0],
	);

	return (
		<SmoothModal
			open={isModalOpen}
			onOpenChange={(open) => {
				setIsModalOpen(open);
				if (!open) setCurrentStep(courseGenerationSteps[0]);
			}}
		>
			<SmoothModalContent>
				<SmoothModalHeader className="items-center justify-center text-center">
					<SmoothModalTitle className="font-serif">
						Genera un nuevo curso
					</SmoothModalTitle>
					<SmoothModalDescription className="text-center">
						Transforma cualquier video de YouTube en una experiencia de
						aprendizaje interactiva
					</SmoothModalDescription>
				</SmoothModalHeader>

				<AristocratCourseGenerationForm
					availableSteps={courseGenerationSteps}
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
				/>
			</SmoothModalContent>
		</SmoothModal>
	);
};

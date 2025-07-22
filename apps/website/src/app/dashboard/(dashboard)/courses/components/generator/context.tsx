'use client';

import { createContext, useContext, useState } from 'react';

interface CourseGenerationContextType {
	isModalOpen: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
}

const CourseGenerationContext = createContext<
	CourseGenerationContextType | undefined
>(undefined);

interface CourseGenerationProviderProps {
	children: React.ReactNode;
}

export function AristocratCourseGenerationProvider({
	children,
}: CourseGenerationProviderProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<CourseGenerationContext.Provider value={{ isModalOpen, setIsModalOpen }}>
			{children}
		</CourseGenerationContext.Provider>
	);
}

export const useAristocratCourseGeneration = () =>
	useContext(CourseGenerationContext)!;

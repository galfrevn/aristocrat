import { useParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { createContext, useContext } from 'react';
import type { Layout } from '@/types/layout';

interface CourseContentProgressContextType {
	currentSelectedLessonId: string;
	setCurrentSelectedLessonId: (lessonId: string) => void;
	currentCourseId: string;
}

const CourseContentProgressContext = createContext<
	CourseContentProgressContextType | undefined
>(undefined);

interface CourseContentProgressProviderProps extends Layout {
	defaultLessonId?: string;
}

export function CourseContentProgressProvider(
	props: CourseContentProgressProviderProps,
) {
	const { children } = props;

	const { id } = useParams();
	const [currentSelectedLessonId, setCurrentSelectedLessonId] = useQueryState(
		'l',
		{
			defaultValue: props.defaultLessonId || '',
			history: 'push',
			scroll: true,
		},
	);

	const courseContentProgressValue = {
		currentSelectedLessonId,
		setCurrentSelectedLessonId,
		currentCourseId: id as string,
	};

	return (
		<CourseContentProgressContext.Provider value={courseContentProgressValue}>
			{children}
		</CourseContentProgressContext.Provider>
	);
}

export const useCourseContentProgress = () =>
	useContext(CourseContentProgressContext) as CourseContentProgressContextType;

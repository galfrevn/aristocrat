import type { Chapter, Lesson } from '@aristocrat/database/schema';

import { useMemo } from 'react';
import {
	estimateLessonTime,
	formatDuration,
} from '@/app/dashboard/courses/[id]/components/hooks/content';

interface UseCourseTotalEstimationProps {
	chapters: Array<
		Chapter & {
			lessons: Array<Lesson>;
		}
	>;
}

export function useCourseTotalEstimation({
	chapters,
}: UseCourseTotalEstimationProps) {
	// Calculate all estimations in a single useMemo to follow Rules of Hooks
	const result = useMemo(() => {
		const chapterDurations = chapters.map((chapter) => {
			const chapterDuration = chapter.lessons.reduce((total, lesson) => {
				const lessonText = lesson.content || lesson.description || '';
				const estimation = estimateLessonTime({
					text: lessonText,
					hasVideo: false, // You can extend this based on lesson type if needed
					hasExercises: false, // You can extend this if you have exercise data
					hasQuiz: false, // You can extend this if you have quiz data
				});
				return total + estimation.totalTime;
			}, 0);

			return chapterDuration;
		});

		const totalEstimation = chapterDurations.reduce(
			(total, duration) => total + duration,
			0,
		);

		return {
			totalEstimation,
			chapterDurations,
			formattedTotalDuration: formatDuration(totalEstimation),
			formattedChapterDurations: chapterDurations.map((duration) =>
				formatDuration(duration),
			),
		};
	}, [chapters]);

	return result;
}

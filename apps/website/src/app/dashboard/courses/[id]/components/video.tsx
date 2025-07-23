'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { trpc } from '@/utils/trpc';
import { generateEmbedUrlFromId } from '@/utils/youtube';

import { useCourseContentProgress } from './hooks';

export function CourseVideo() {
	const { id } = useParams();
	const course = useQuery({
		...trpc.courses.$get.content.queryOptions({
			courseId: id as string,
		}),
	});

	const { currentSelectedLessonId } = useCourseContentProgress();

	const currentSelectedLessonTimeframe = useMemo(() => {
		const currentSelectedLesson = course.data?.chapters
			.flatMap((chapter) => chapter.lessons)
			.find((lesson) => lesson.id === currentSelectedLessonId);

		return {
			start: currentSelectedLesson?.startTime as string,
			end: currentSelectedLesson?.endTime as string,
		};
	}, [course.data, currentSelectedLessonId]);

	if (!course.data?.youtubeVideoId) {
		return null;
	}

	return (
		<iframe
			src={generateEmbedUrlFromId(
				course.data.youtubeVideoId,
				currentSelectedLessonTimeframe,
			)}
			title={course.data.title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			className="h-[800px] w-full bg-black"
		/>
	);
}

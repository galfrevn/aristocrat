import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/utils/trpc';

// Course Progress Hooks
export function useCourseProgress(courseId: string) {
	return useQuery({
		...trpc.progress.course.get.queryOptions({ courseId }),
		enabled: !!courseId,
	});
}

export function useCourseProgressMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.course.upsert.mutationOptions(),
		onSuccess: (data) => {
			// Invalidate related queries
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.get.queryKey({
					courseId: data.courseId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.list.queryKey(),
			});
		},
	});
}

export function useCompleteCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.course.markCompleted.mutationOptions(),
		onSuccess: (data) => {
			toast.success('¡Curso completado exitosamente!');
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.get.queryKey({
					courseId: data.courseId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.list.queryKey(),
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

// Chapter Progress Hooks
export function useChapterProgress(chapterId: string) {
	return useQuery({
		...trpc.progress.chapter.get.queryOptions({ chapterId }),
		enabled: !!chapterId,
	});
}

export function useChaptersProgressByCourse(courseId: string) {
	return useQuery({
		...trpc.progress.chapter.listByCourse.queryOptions({ courseId }),
		enabled: !!courseId,
	});
}

export function useChapterProgressMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.chapter.upsert.mutationOptions(),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.get.queryKey({
					chapterId: data.chapterId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.listByCourse.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.list.queryKey(),
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

export function useCompleteChapter() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.chapter.markCompleted.mutationOptions(),
		onSuccess: (data) => {
			toast.success('¡Capítulo completado!');
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.get.queryKey({
					chapterId: data.chapterId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.listByCourse.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.list.queryKey(),
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

// Lesson Progress Hooks
export function useLessonProgress(lessonId: string) {
	return useQuery({
		...trpc.progress.lesson.get.queryOptions({ lessonId }),
		enabled: !!lessonId,
	});
}

export function useLessonsProgressByChapter(chapterId: string) {
	return useQuery({
		...trpc.progress.lesson.listByChapter.queryOptions({ chapterId }),
		enabled: !!chapterId,
	});
}

export function useLessonAccess(lessonId: string) {
	return useQuery({
		...trpc.progress.lesson.canAccess.queryOptions({ lessonId }),
		enabled: !!lessonId,
	});
}

export function useLessonProgressMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.lesson.upsert.mutationOptions(),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.get.queryKey({
					lessonId: data.lessonId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.listByChapter.queryKey(),
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

export function useCompleteLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.lesson.markCompleted.mutationOptions(),
		onSuccess: (data) => {
			toast.success('¡Lección completada!');
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.get.queryKey({
					lessonId: data.lessonId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.listByChapter.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.canAccess.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.listByCourse.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.list.queryKey(),
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

// Exercise Response Hooks
export function useExerciseResponses(exerciseId: string) {
	return useQuery({
		...trpc.progress.exercise.get.queryOptions({ exerciseId }),
		enabled: !!exerciseId,
	});
}

export function useLatestExerciseResponse(exerciseId: string) {
	return useQuery({
		...trpc.progress.exercise.getLatest.queryOptions({ exerciseId }),
		enabled: !!exerciseId,
	});
}

export function useSubmitExercise() {
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.progress.exercise.submit.mutationOptions(),
		onSuccess: async (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: trpc.progress.exercise.get.queryKey({
					exerciseId: variables.exerciseId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.exercise.getLatest.queryKey({
					exerciseId: variables.exerciseId,
				}),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.listByChapter.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.lesson.canAccess.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.chapter.listByCourse.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.get.queryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: trpc.progress.course.list.queryKey(),
			});
		},
		onError: (error) => {
			toast.error('Error al enviar la respuesta: ' + error.message);
		},
	});
}

// Utility hooks for progress states
export function useProgressStates(courseId: string) {
	const courseProgress = useCourseProgress(courseId);
	const chaptersProgress = useChaptersProgressByCourse(courseId);

	return {
		courseProgress: courseProgress.data,
		chaptersProgress: chaptersProgress.data || [],
		isLoading: courseProgress.isLoading || chaptersProgress.isLoading,
		error: courseProgress.error || chaptersProgress.error,
	};
}
export function useAutoProgressTracking(
	courseId: string,
	chapters: Array<{ id: string; lessons: Array<{ id: string }> }>,
) {
	const { data: chaptersProgress } = useChaptersProgressByCourse(courseId);
	const { data: courseProgress } = useCourseProgress(courseId);
	const chapterProgressMutation = useChapterProgressMutation();
	const courseProgressMutation = useCourseProgressMutation();

	useEffect(() => {
		if (!chaptersProgress || !chapters) return;

		if (!courseProgress && chapters.length > 0) {
			courseProgressMutation.mutate({
				courseId,
				status: 'in_progress',
				completionPercentage: 0,
			});
		}

		chapters.forEach(async (chapter) => {
			const chapterProgressRecord = chaptersProgress.find(
				(cp) => cp.id === chapter.id,
			);
			const chapterProgress = chapterProgressRecord?.progress;

			if (!chapterProgress && chapter.lessons.length > 0) {
				chapterProgressMutation.mutate({
					chapterId: chapter.id,
					status: 'not_started',
					completionPercentage: 0,
				});
				return;
			}

			if (chapterProgress && chapterProgressRecord) {
				const lessonsWithProgress = chapterProgressRecord.lessons || [];
				const completedLessons = lessonsWithProgress.filter(
					(l) => l.progress?.status === 'completed',
				).length;
				const totalLessons = chapter.lessons.length;

				if (
					totalLessons > 0 &&
					completedLessons === totalLessons &&
					chapterProgress.status !== 'completed'
				) {
					chapterProgressMutation.mutate({
						chapterId: chapter.id,
						status: 'completed',
						completionPercentage: 100,
					});
				} else if (totalLessons > 0 && chapterProgress.status !== 'completed') {
					const progressPercentage = Math.round(
						(completedLessons / totalLessons) * 100,
					);
					if (progressPercentage !== chapterProgress.completionPercentage) {
						chapterProgressMutation.mutate({
							chapterId: chapter.id,
							status: completedLessons > 0 ? 'in_progress' : 'not_started',
							completionPercentage: progressPercentage,
						});
					}
				}
			}
		});

		if (courseProgress && chaptersProgress.length > 0) {
			const completedChapters = chaptersProgress.filter(
				(cp) => cp.progress?.status === 'completed',
			).length;
			const totalChapters = chapters.length;

			if (
				totalChapters > 0 &&
				completedChapters === totalChapters &&
				courseProgress.status !== 'completed'
			) {
				courseProgressMutation.mutate({
					courseId,
					status: 'completed',
					completionPercentage: 100,
				});
			} else if (totalChapters > 0 && courseProgress.status !== 'completed') {
				const progressPercentage = Math.round(
					(completedChapters / totalChapters) * 100,
				);
				if (progressPercentage !== courseProgress.completionPercentage) {
					courseProgressMutation.mutate({
						courseId,
						status: completedChapters > 0 ? 'in_progress' : 'not_started',
						completionPercentage: progressPercentage,
					});
				}
			}
		}
	}, [
		chaptersProgress,
		courseProgress,
		chapters,
		courseId,
		chapterProgressMutation,
		courseProgressMutation,
	]);
}

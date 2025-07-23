import type { Chapter, Lesson } from '@aristocrat/database/schema';
import { Award, Clock, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { useCourseContentProgress } from '@/app/dashboard/courses/[id]/components/hooks';
import { useCourseTotalEstimation } from '@/app/dashboard/courses/[id]/components/hooks/estimation';
import { ContentRootSidebarLesson } from '@/app/dashboard/courses/[id]/components/sidebar/lesson';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	useChapterProgressMutation,
	useChaptersProgressByCourse,
	useCompleteCourse,
	useCourseProgress,
	useCourseProgressMutation,
} from '@/hooks/progress';

interface ContentRootSidebarProps {
	chapters: Array<
		Chapter & {
			lessons: Array<Lesson>;
		}
	>;
	courseId: string;
}

export function ContentRootSidebar(props: ContentRootSidebarProps) {
	const { chapters, courseId } = props;
	const { totalEstimation } = useCourseTotalEstimation({ chapters });
	const { currentSelectedLessonId } = useCourseContentProgress();

	const { data: courseProgress } = useCourseProgress(courseId);
	const { data: chaptersProgress } = useChaptersProgressByCourse(courseId);
	const completeCourse = useCompleteCourse();
	const chapterProgressMutation = useChapterProgressMutation();
	const courseProgressMutation = useCourseProgressMutation();

	const currentSelectedChapter =
		chapters.find((chapter) =>
			chapter.lessons.some((lesson) => lesson.id === currentSelectedLessonId),
		) || chapters[0];

	const completedChapters =
		chaptersProgress?.filter((ch) => ch.progress?.status === 'completed')
			.length || 0;
	const totalChapters = chapters.length;
	const progressPercentage =
		totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

	const allChaptersCompleted =
		totalChapters > 0 && completedChapters === totalChapters;
	const isCourseCompleted = courseProgress?.status === 'completed';

	const handleCompleteCourse = () => {
		completeCourse.mutate({ courseId });
	};

	return (
		<aside className="flex h-full w-full flex-col">
			<Tabs defaultValue="content" className="flex h-full w-full flex-col">
				<TabsList className="mx-2 mt-2 w-auto">
					<TabsTrigger value="content">Contenido del curso</TabsTrigger>
					<TabsTrigger disabled value="ai">
						Asistente AI
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value="content"
					className="no-scrollbar flex-1 overflow-y-auto p-2"
				>
					{/* Course Progress Section */}
					<div className="mx-2 mb-4 space-y-3">
						{totalEstimation > 0 && (
							<div className="rounded-lg bg-muted p-3">
								<div className="flex items-center justify-between text-sm">
									<span className="font-medium">Duración total estimada:</span>
									<Badge variant="default">
										<Clock className="mr-1 h-3 w-3" />
										{Math.floor(totalEstimation / 60)}h {totalEstimation % 60}m
									</Badge>
								</div>
							</div>
						)}

						{/* Progress Bar */}
						<div className="rounded-lg bg-muted p-3">
							<div className="mb-2 flex items-center justify-between text-sm">
								<span className="font-medium">Progreso del curso:</span>
								<span className="text-muted-foreground">
									{completedChapters}/{totalChapters} capítulos
								</span>
							</div>
							<Progress value={progressPercentage} className="h-2" />
							<div className="mt-1 text-right text-muted-foreground text-xs">
								{Math.round(progressPercentage)}% completado
							</div>
						</div>

						{/* Course Completion Button */}
						{allChaptersCompleted && !isCourseCompleted && (
							<div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-3">
								<div className="mb-2 flex items-center gap-2">
									<Trophy className="h-4 w-4 text-green-600" />
									<span className="font-medium text-green-800 text-sm">
										¡Listo para completar!
									</span>
								</div>
								<p className="mb-3 text-green-700 text-xs">
									Has completado todos los capítulos. ¡Felicitaciones!
								</p>
								<Button
									onClick={handleCompleteCourse}
									disabled={completeCourse.isPending}
									className="w-full bg-green-600 text-white hover:bg-green-700"
									size="sm"
								>
									{completeCourse.isPending ? (
										'Completando...'
									) : (
										<>
											<Award className="mr-2 h-4 w-4" />
											Completar Curso
										</>
									)}
								</Button>
							</div>
						)}

						{/* Course Completed Status */}
						{isCourseCompleted && (
							<div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
								<div className="flex items-center gap-2">
									<Trophy className="h-4 w-4 text-yellow-600" />
									<span className="font-medium text-sm text-yellow-800">
										¡Curso Completado!
									</span>
								</div>
								<p className="mt-1 text-xs text-yellow-700">
									Has completado exitosamente este curso.
								</p>
							</div>
						)}
					</div>

					<Accordion
						type="multiple"
						defaultValue={[currentSelectedChapter.id]}
						className="w-full"
					>
						{chapters.map((chapter, chapterIndex) => {
							const chapterWithProgress = chaptersProgress?.find(
								(cp) => cp.id === chapter.id,
							);
							const chapterProgress = chapterWithProgress?.progress;
							const isChapterCompleted =
								chapterProgress?.status === 'completed';

							return (
								<AccordionItem key={chapter.id} value={chapter.id}>
									<AccordionTrigger>
										<div className="mx-2 flex w-full items-center justify-between pr-4">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h4 className="text-left text-base leading-tight">
														<b>Sección {chapterIndex + 1}: </b>
														{chapter.title}
													</h4>
													{isChapterCompleted && (
														<Badge
															variant="outline"
															className="border-green-200 bg-green-50 text-green-700 text-xs"
														>
															Completado
														</Badge>
													)}
												</div>
												<p className="text-left text-muted-foreground text-sm">
													{chapter.lessons.length} lecciones
												</p>
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent>
										<ul>
											{chapter.lessons.map((lesson, lessonIndex) => (
												<ContentRootSidebarLesson
													key={lesson.id}
													lesson={lesson}
													currentChapterIndex={chapterIndex}
													currentLessonIndex={lessonIndex}
												/>
											))}
										</ul>
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				</TabsContent>
			</Tabs>
		</aside>
	);
}

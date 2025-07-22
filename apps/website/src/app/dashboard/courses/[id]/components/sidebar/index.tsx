import type { Chapter, Lesson } from '@aristocrat/database/schema';
import { Clock } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentRootSidebarProps {
	chapters: Array<
		Chapter & {
			lessons: Array<Lesson>;
		}
	>;
}

export function ContentRootSidebar(props: ContentRootSidebarProps) {
	const { chapters } = props;
	const { totalEstimation } = useCourseTotalEstimation({ chapters });
	const { currentSelectedLessonId } = useCourseContentProgress();

	const currentSelectedChapter =
		chapters.find((chapter) =>
			chapter.lessons.some((lesson) => lesson.id === currentSelectedLessonId),
		) || chapters[0];

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
					{totalEstimation > 0 && (
						<div className="mx-2 mb-4 rounded-lg bg-muted p-3">
							<div className="flex items-center justify-between text-sm">
								<span className="font-medium">Duración total estimada:</span>
								<Badge variant="default">
									<Clock className="mr-1 h-3 w-3" />
									{Math.floor(totalEstimation / 60)}h {totalEstimation % 60}m
								</Badge>
							</div>
						</div>
					)}

					<Accordion
						type="multiple"
						defaultValue={[currentSelectedChapter.id]}
						className="w-full"
					>
						{chapters.map((chapter, chapterIndex) => (
							<AccordionItem key={chapter.id} value={chapter.id}>
								<AccordionTrigger>
									<div className="mx-2 flex w-full items-center justify-between pr-4">
										<div>
											<h4 className="text-left text-base leading-tight">
												<b>Sección {chapterIndex + 1}: </b>
												{chapter.title}
											</h4>
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
						))}
					</Accordion>
				</TabsContent>
			</Tabs>
		</aside>
	);
}

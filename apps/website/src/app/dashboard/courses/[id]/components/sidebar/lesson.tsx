import type { Lesson } from '@aristocrat/database/schema';
import { BookOpen, Clock } from 'lucide-react';
import { useContentEstimation } from '@/app/dashboard/courses/[id]/components/hooks/content';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCourseContentProgress } from '../hooks';

interface ContentRootSidebarLessonProps {
	lesson: Lesson;
	currentChapterIndex: number;
	currentLessonIndex: number;
}

export function ContentRootSidebarLesson(props: ContentRootSidebarLessonProps) {
	const { lesson, currentChapterIndex, currentLessonIndex } = props;

	const { setCurrentSelectedLessonId } = useCourseContentProgress();

	const estimation = useContentEstimation({
		text: lesson.content || lesson.description || undefined,
		hasVideo: true,
		hasExercises: true,
		// You can add more properties here if your lessons have them
		// exerciseCount: lesson.exerciseCount,
	});

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<li
			key={lesson.id}
			className="rounded-md px-2 py-2 transition-colors duration-200 hover:bg-muted/50"
			onClick={() => setCurrentSelectedLessonId(lesson.id)}
		>
			<div className="flex items-start gap-3">
				<Checkbox id={lesson.id} defaultChecked />
				<div className="grid flex-1 gap-2">
					<div className="flex items-center justify-between">
						<Label htmlFor={lesson.id} className="font-medium text-sm">
							{currentChapterIndex + 1}.{currentLessonIndex + 1}. {lesson.title}
						</Label>
						{estimation.totalTime > 0 && (
							<Badge variant="secondary" className="ml-2 text-xs">
								<Clock className="mr-1 h-3 w-3" />
								{estimation.formattedDuration}
							</Badge>
						)}
					</div>
					<p className="text-muted-foreground text-sm">{lesson.description}</p>
					{estimation.wordCount > 0 && (
						<div className="flex items-center gap-4 text-muted-foreground text-xs">
							<span className="flex items-center gap-1">
								<BookOpen className="h-3 w-3" />
								{estimation.wordCount} palabras
							</span>
						</div>
					)}
				</div>
			</div>
		</li>
	);
}

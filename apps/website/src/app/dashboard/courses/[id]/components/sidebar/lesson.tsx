/** biome-ignore-all lint/a11y/noStaticElementInteractions: false positive */

import type { lessons } from '@aristocrat/database/schema';
import { BookOpen, Clock, Lock } from 'lucide-react';
import { useContentEstimation } from '@/app/dashboard/courses/[id]/components/hooks/content';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLessonAccess, useLessonProgress } from '@/hooks/progress';
import { useCourseContentProgress } from '../hooks';

type Lesson = typeof lessons.$inferSelect;

interface ContentRootSidebarLessonProps {
	lesson: Lesson;
	currentChapterIndex: number;
	currentLessonIndex: number;
}

export function ContentRootSidebarLesson(props: ContentRootSidebarLessonProps) {
	const { lesson, currentChapterIndex, currentLessonIndex } = props;

	const { setCurrentSelectedLessonId } = useCourseContentProgress();
	const { data: lessonProgress } = useLessonProgress(lesson.id);
	const { data: accessData } = useLessonAccess(lesson.id);

	const estimation = useContentEstimation({
		text: lesson.content || lesson.description || undefined,
		hasVideo: true,
		hasExercises: true,
		// You can add more properties here if your lessons have them
		// exerciseCount: lesson.exerciseCount,
	});

	const isCompleted = lessonProgress?.status === 'completed';
	const canAccess = accessData?.canAccess ?? false;
	const isLocked = !canAccess;

	const handleClick = () => {
		if (canAccess) {
			setCurrentSelectedLessonId(lesson.id);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	};

	return (
		<li>
			<TooltipProvider>
				<div
					key={lesson.id}
					className={`rounded-md px-2 py-2 transition-colors duration-200 ${
						canAccess
							? 'cursor-pointer hover:bg-muted/50'
							: 'cursor-not-allowed opacity-60'
					}`}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
				>
					<div className="flex items-start gap-3">
						<Checkbox
							id={lesson.id}
							checked={isCompleted}
							disabled={!canAccess}
							className={isCompleted ? 'data-[state=checked]:bg-green-600' : ''}
						/>
						<div className="grid flex-1 gap-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Label
										htmlFor={lesson.id}
										className={`font-medium text-sm ${
											!canAccess ? 'text-muted-foreground' : ''
										}`}
									>
										{currentChapterIndex + 1}.{currentLessonIndex + 1}.{' '}
										{lesson.title}
									</Label>
									{isLocked && (
										<Tooltip>
											<TooltipTrigger>
												<Lock className="h-3 w-3 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													{accessData && 'reason' in accessData
														? accessData.reason
														: 'Lección no disponible'}
												</p>
											</TooltipContent>
										</Tooltip>
									)}
									{isCompleted && (
										<Badge
											variant="outline"
											className="border-green-200 bg-green-50 text-green-700 text-xs"
										>
											Completada
										</Badge>
									)}
								</div>
								{estimation.totalTime > 0 && (
									<Badge variant="secondary" className="ml-2 text-xs">
										<Clock className="mr-1 h-3 w-3" />
										{estimation.formattedDuration}
									</Badge>
								)}
							</div>
							<p
								className={`text-sm ${
									!canAccess
										? 'text-muted-foreground/70'
										: 'text-muted-foreground'
								}`}
							>
								{lesson.description}
							</p>
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
				</div>
			</TooltipProvider>
		</li>
	);
}

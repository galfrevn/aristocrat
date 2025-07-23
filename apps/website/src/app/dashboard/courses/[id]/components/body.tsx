import type { Lesson } from '@aristocrat/database/schema';
import { useQuery } from '@tanstack/react-query';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { LessonExercises } from './exercises';
import { useCourseContentProgress } from './hooks';
import { ContentRootMarkdown } from './markdown';

function ExpandableContent({ content }: { content: string }) {
	const [isExpanded, setIsExpanded] = useState(false);

	const preview = content.slice(0, 100);
	const shouldTruncate = content.length > 100;

	return (
		<div>
			<div className="prose prose-xs prose-slate max-w-none text-xs">
				<ContentRootMarkdown
					type="concept"
					content={
						isExpanded ? content : shouldTruncate ? `${preview}...` : content
					}
				/>
			</div>
			{shouldTruncate && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsExpanded(!isExpanded)}
					className="mt-2 h-6 px-2 text-xs"
				>
					{isExpanded ? 'Mostrar menos' : 'Mostrar más'}
				</Button>
			)}
		</div>
	);
}

function getFaviconUrl(url: string): string {
	try {
		const domain = new URL(url).hostname;
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
	} catch {
		return 'https://www.google.com/s2/favicons?domain=example.com&sz=16';
	}
}

export function ContentRootBody() {
	const { currentCourseId, currentSelectedLessonId } =
		useCourseContentProgress();

	const course = useQuery({
		...trpc.courses.$get.content.queryOptions({
			courseId: currentCourseId,
		}),
	});

	const currentLessonContent = useMemo(
		() =>
			course.data?.chapters
				.flatMap((chapter) => chapter.lessons)
				.find((lesson) => lesson.id === currentSelectedLessonId),
		[course.data, currentSelectedLessonId],
	) as unknown as Lesson;

	const exercises = useQuery({
		enabled: !!currentSelectedLessonId,
		...trpc.courses.$get.exercises.queryOptions({
			lessonId: currentSelectedLessonId,
		}),
	});

	return (
		<div className="mx-auto max-w-7xl p-6">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Main Content Column */}
				<div className="lg:col-span-2">
					<h1 className="mb-6 font-bold text-2xl">
						{currentLessonContent?.title}
					</h1>
					<div className="prose prose-slate max-w-none">
						<ContentRootMarkdown
							content={currentLessonContent?.content || ''}
						/>
					</div>

					{/* Exercises Section */}
					{exercises.data && exercises.data.length > 0 && course.data && (
						<div className="mt-8">
							<LessonExercises
								course={course.data as any}
								exercises={exercises.data as any}
							/>
						</div>
					)}
				</div>

				{/* Conceptos Column */}
				<div className="lg:col-span-1">
					<h2 className="mb-4 font-semibold text-lg">Conceptos</h2>
					<div className="space-y-3">
						{currentLessonContent?.keyConcepts?.map((concept) => (
							<Card key={concept.title} className="shadow-sm">
								<CardContent className="pt-0">
									{concept.title}
									<ExpandableContent
										content={concept.researchedContent || ''}
									/>
									{concept.references && concept.references.length > 0 && (
										<div className="mt-3 border-t pt-2">
											<p className="mb-1 font-medium text-muted-foreground text-xs">
												Referencias:
											</p>
											<div className="flex flex-wrap gap-2">
												{concept.references.map((reference, index) => (
													<a
														key={`${concept.title}-ref-${index}`}
														href={reference}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-1 rounded bg-muted px-2 py-1 transition-colors hover:bg-muted-foreground/10"
														title={reference}
													>
														<img
															src={getFaviconUrl(reference)}
															alt=""
															className="h-3 w-3"
															onError={(e) => {
																e.currentTarget.style.display = 'none';
															}}
														/>
														<span className="text-muted-foreground text-xs">
															{new URL(reference).hostname}
														</span>
													</a>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

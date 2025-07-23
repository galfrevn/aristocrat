import type { Chapter, Course } from '@aristocrat/database/schema';

import Image from 'next/image';
import Link from 'next/link';

import { AristocratIcons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCourseProgress } from '@/hooks/progress';

interface AristocratCoursesListCardProps {
	course: Course & { chapters: Array<Chapter> };
}

export const AristocratCoursesListCard = (
	props: AristocratCoursesListCardProps,
) => {
	const { course } = props;
	const { data: courseProgress } = useCourseProgress(course.id);

	const progressPercentage = courseProgress?.completionPercentage || 0;
	const isCompleted = courseProgress?.status === 'completed';
	const hasStarted = courseProgress?.status === 'in_progress' || isCompleted;

	return (
		<Card className="group h-min cursor-pointer pt-0 pb-2">
			<Link href={`/dashboard/courses/${course.id}`}>
				<div className="relative overflow-hidden">
					<Image
						width={400}
						height={256}
						alt={course.title}
						src={course.thumbnail || '/placeholder.svg'}
						className="h-64 w-full rounded-xl object-cover"
					/>
					<div className="absolute inset-0" />
					<div className="absolute top-3 left-3 flex gap-2">
						{course.category && (
							<Badge variant="secondary">{course.category}</Badge>
						)}
						{isCompleted && (
							<Badge className="bg-green-600 text-white">
								<AristocratIcons.Check className="mr-1 h-3 w-3" />
								Completado
							</Badge>
						)}
						{hasStarted && !isCompleted && (
							<Badge
								variant="outline"
								className="border-blue-200 bg-blue-50 text-blue-700"
							>
								En progreso
							</Badge>
						)}
					</div>
					{/* <div className="absolute top-3 right-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									className="h-8 w-8 border bg-background p-0 text-foreground"
									onClick={(e) => e.stopPropagation()}
								>
									<AristocratIcons.Book className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Continue Learning</DropdownMenuItem>
								<DropdownMenuItem>Add to Favorites</DropdownMenuItem>
								<DropdownMenuItem>Download for Offline</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div> */}
				</div>
			</Link>

			<CardContent className="p-4 pt-0">
				<div className="space-y-3">
					<div>
						<h3 className="line-clamp-2 font-semibold text-xl transition-colors">
							{course.title}
						</h3>
						<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
							{course.description}
						</p>
					</div>

					<div className="flex items-center space-x-4 text-xs">
						<div className="flex items-center space-x-1">
							<AristocratIcons.Clock className="h-3 w-3" />
							<span>
								{course.estimatedDuration || Math.floor(Math.random() * 100)}{' '}
								min
							</span>
						</div>
						<div className="flex items-center space-x-1">
							<AristocratIcons.BookOpen className="h-3 w-3" />
							<span>{course.chapters.length} capítulos</span>
						</div>
						{/* <div className="flex items-center space-x-1">
							<AristocratIcons.Stars className="h-3 w-3 fill-yellow-400 text-yellow-400" />
							<span>{course.rating}</span>
						</div> */}
					</div>

					<div className="flex flex-wrap gap-1">
						{course.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
						{course.tags.length > 3 && (
							<Badge variant="outline" className="text-xs ">
								+{course.tags.length - 3}
							</Badge>
						)}
					</div>

					{/* <div className="flex items-center justify-between border-t pt-2 ">
						<div className="flex items-center space-x-2">
							<div className="h-6 w-6 rounded-full bg-foreground" />
							<span className="text-sm">John Doe</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className="font-medium text-sm ">$100</span>
							<AristocratIcons.ChevronRight className="h-4 w-4" />
						</div>
					</div> */}

					{hasStarted && (
						<div className="flex items-center justify-between border-t pt-3 text-xs">
							<div className="flex items-center space-x-1 text-muted-foreground">
								{isCompleted ? (
									<>
										<AristocratIcons.Check className="h-3 w-3 text-green-600" />
										<span className="text-green-600">Curso completado</span>
									</>
								) : (
									<>
										<AristocratIcons.Clock className="h-3 w-3" />
										<span>En progreso: {Math.round(progressPercentage)}%</span>
									</>
								)}
							</div>
							{courseProgress?.updatedAt && (
								<span className="text-muted-foreground">
									{new Date(courseProgress.updatedAt).toLocaleDateString(
										'es-ES',
										{
											month: 'short',
											day: 'numeric',
										},
									)}
								</span>
							)}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

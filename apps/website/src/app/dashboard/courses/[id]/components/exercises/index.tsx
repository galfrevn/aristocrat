import type {
	Chapter,
	Course,
	Exercise,
	Lesson,
} from '@aristocrat/database/schema';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useCourseContentProgress } from '../hooks';

/* import { MultipleChoiceExercise } from './multiple-choice';
import { FillInBlankExercise } from './fill-in-blank';
import { FreeTextExercise } from './free-text'; */
import { CodeCompletionExercise } from './code';
import { FillInBlankExercise } from './fill';
import { MultipleChoiceExercise } from './multiple';

interface LessonExercisesProps {
	exercises: Array<Exercise>;
	course: Course & {
		chapters: Array<
			Chapter & {
				lessons: Array<Lesson>;
			}
		>;
	};
}

const difficultyColors = {
	easy: 'bg-green-100 text-green-800 hover:bg-green-200',
	medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
	hard: 'bg-red-100 text-red-800 hover:bg-red-200',
} as const;

const difficultyLabels = {
	easy: 'Fácil',
	medium: 'Intermedio',
	hard: 'Difícil',
} as const;

export function LessonExercises(props: LessonExercisesProps) {
	const { course, exercises } = props;
	const { currentSelectedLessonId, setCurrentSelectedLessonId } =
		useCourseContentProgress();

	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [completedExercises, setCompletedExercises] = useState<Set<string>>(
		new Set(),
	);

	const currentExercise = exercises[currentExerciseIndex];

	const handleExerciseComplete = (exerciseId: string) => {
		setCompletedExercises((prev) => new Set([...prev, exerciseId]));

		if (currentExerciseIndex < exercises.length - 1) {
			setTimeout(() => {
				setCurrentExerciseIndex(currentExerciseIndex + 1);
			}, 1500);
		}
	};

	const computedFollowingLesson = useMemo(() => {
		const allLessons = course.chapters.flatMap(
			(chapter: Chapter & { lessons: Array<Lesson> }) => chapter.lessons,
		);
		const currentLessonIndex = allLessons.findIndex(
			(lesson: Lesson) => lesson.id === currentSelectedLessonId,
		);

		return allLessons[currentLessonIndex + 1];
	}, [course.chapters, currentSelectedLessonId]);

	const navigateToExercise = (index: number) => {
		setCurrentExerciseIndex(index);
	};

	console.log(exercises);

	if (!exercises || exercises.length === 0) {
		return (
			<div className="mt-8">
				<h2 className="mb-4 font-semibold text-xl">Ejercicios</h2>
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							No hay ejercicios disponibles para esta lección.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="mt-8">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="font-semibold text-xl">Ejercicios</h2>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<span>
						{currentExerciseIndex + 1} de {exercises.length}
					</span>
					<span>•</span>
					<span>{completedExercises.size} completados</span>
				</div>
			</div>

			{exercises.length > 1 && (
				<div className="mb-6 flex flex-wrap gap-2">
					{exercises.map((exercise, index) => (
						<button
							type="button"
							key={exercise.id}
							onClick={() => navigateToExercise(index)}
							className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 font-medium text-sm transition-colors ${
								index === currentExerciseIndex
									? 'border-primary bg-primary text-primary-foreground'
									: completedExercises.has(exercise.id)
										? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
										: 'border-muted-foreground/20 bg-background hover:border-muted-foreground/40 hover:bg-muted/50'
							}`}
						>
							{index + 1}
						</button>
					))}
				</div>
			)}

			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<CardTitle className="text-lg">{currentExercise.title}</CardTitle>
							<CardDescription className="mt-1">
								{currentExercise.description}
							</CardDescription>
						</div>
						<Badge
							variant="secondary"
							className={
								// @ts-expect-error - difficulty is not defined in the Exercise type
								difficultyColors[currentExercise.difficulty || 'medium']
							}
						>
							{/* @ts-expect-error - difficulty is not defined in the Exercise type */}
							{difficultyLabels[currentExercise.difficulty || 'medium']}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					{currentExercise.type === 'multiple_choice' && (
						<MultipleChoiceExercise exercise={currentExercise} />
					)}

					{currentExercise.type === 'fill_blank' && (
						<FillInBlankExercise exercise={currentExercise} />
					)}

					{/* {currentExercise.type === 'free_text' && (
						<FreeTextExercise
							exercise={currentExercise}
							isCompleted={completedExercises.has(currentExercise.id)}
							onComplete={() => handleExerciseComplete(currentExercise.id)}
						/>
					)} */}

					{currentExercise.type === 'code' && (
						<CodeCompletionExercise exercise={currentExercise} />
					)}
				</CardContent>
			</Card>

			{completedExercises.size === exercises.length && (
				<Card className="mt-6 ">
					<CardContent>
						<div className="text-center">
							<h3 className="font-semibold text-primary">¡Felicitaciones!</h3>
							<p>Has completado todos los ejercicios de esta lección.</p>
						</div>
						<CardAction>
							<Button
								onClick={() =>
									setCurrentSelectedLessonId(
										computedFollowingLesson?.id as string,
									)
								}
							>
								Continuar con la proxima lección
							</Button>
						</CardAction>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

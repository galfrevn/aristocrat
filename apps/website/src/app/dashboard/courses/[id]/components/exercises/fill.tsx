import type { Exercise } from '@aristocrat/database/schema';
import { AlertCircleIcon, CheckCircle2Icon, LightbulbIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Markdown } from '@/components/ui/markdown';
import { useLatestExerciseResponse, useSubmitExercise } from '@/hooks/progress';

interface FillInBlankExerciseProps {
	exercise: Exercise;
}

export function FillInBlankExercise({ exercise }: FillInBlankExerciseProps) {
	const [userAnswers, setUserAnswers] = useState<string[]>([]);
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);

	const { data: latestResponse } = useLatestExerciseResponse(exercise.id);
	const submitExercise = useSubmitExercise();

	// Count blanks in the question
	const blankPattern = /___+|\{blank\}/g;
	const blanks = exercise.question.match(blankPattern) || [];
	const hasEmbeddedBlanks = blanks.length > 0;
	const totalInputs = hasEmbeddedBlanks ? blanks.length : 1;

	// Single function to validate answers - fixes the comparison logic
	const validateAnswer = (userAnswer: string, index: number): boolean => {
		const correctAnswers = exercise.correctAnswer.split('|');
		const correctAnswer = correctAnswers[index] || correctAnswers[0]; // Fallback to first answer if only one provided

		const normalizedUserAnswer = userAnswer.trim().toLowerCase();
		const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();

		// If there's a validation regex, use it (but with normalized input)
		if (exercise.validationRegex) {
			try {
				const cleanPattern = exercise.validationRegex.replace(/^\(\?\w+\)/, '');
				const regex = new RegExp(cleanPattern, 'i'); // Case-insensitive regex
				return regex.test(normalizedUserAnswer);
			} catch (error) {
				console.warn('Invalid regex pattern:', exercise.validationRegex, error);
				// Fall back to string comparison if regex fails
				return normalizedUserAnswer === normalizedCorrectAnswer;
			}
		}

		// Default string comparison
		return normalizedUserAnswer === normalizedCorrectAnswer;
	};

	// Initialize answers array if empty
	useEffect(() => {
		if (userAnswers.length === 0) {
			setUserAnswers(new Array(totalInputs).fill(''));
		}
	}, [totalInputs, userAnswers.length]);

	// Load previous response on component mount
	useEffect(() => {
		if (latestResponse) {
			// Parse the user answer as JSON array or use as single string
			try {
				const parsedAnswers = JSON.parse(latestResponse.userAnswer);
				if (Array.isArray(parsedAnswers)) {
					setUserAnswers(parsedAnswers);
				} else {
					setUserAnswers([latestResponse.userAnswer]);
				}
			} catch {
				// If not valid JSON, treat as single answer
				setUserAnswers([latestResponse.userAnswer]);
			}
			setHasSubmitted(true);
			setShowExplanation(true);
		}
	}, [latestResponse]);

	const handleAnswerChange = (index: number, value: string) => {
		const newAnswers = [...userAnswers];
		newAnswers[index] = value;
		setUserAnswers(newAnswers);
	};

	const handleSubmit = async () => {
		if (userAnswers.some((answer) => !answer.trim())) return;

		const isCorrect = userAnswers.every((answer, index) =>
			validateAnswer(answer, index),
		);

		const pointsEarned = isCorrect ? exercise.points || 10 : 0;

		// Save the response to the database
		const userAnswerString =
			userAnswers.length === 1 ? userAnswers[0] : JSON.stringify(userAnswers);

		await submitExercise.mutateAsync({
			exerciseId: exercise.id,
			userAnswer: userAnswerString,
			isCorrect,
			pointsEarned,
		});

		setHasSubmitted(true);
		setShowExplanation(true);
	};

	const handleReset = () => {
		setUserAnswers(new Array(totalInputs).fill(''));
		setHasSubmitted(false);
		setShowExplanation(false);
	};

	const correctAnswers = exercise.correctAnswer.split('|');
	const isCorrect =
		hasSubmitted &&
		userAnswers.every((answer, index) => validateAnswer(answer, index));

	const isCompleted = latestResponse?.isCorrect || false;

	return (
		<div className="space-y-6">
			<div>
				{/* Always render the markdown question */}
				<Markdown content={exercise.question} />

				{/* If there are blanks, show input fields for them */}
				{hasEmbeddedBlanks && (
					<div className="mt-6 space-y-4">
						<h4 className="font-medium text-muted-foreground text-sm">
							Completa los espacios en blanco:
						</h4>
						<div className="grid gap-3">
							{blanks.map((blank, index) => (
								<div
									key={`blank-${blank.slice ? blank.slice(0, 3) : blank}-${index}`}
									className="flex items-center gap-3"
								>
									<span className="w-16 font-medium text-muted-foreground text-sm">
										Espacio {index + 1}:
									</span>
									<Input
										type="text"
										value={userAnswers[index] || ''}
										onChange={(e) => handleAnswerChange(index, e.target.value)}
										disabled={hasSubmitted}
										className={`flex-1 ${
											hasSubmitted
												? isCorrect
													? 'border-green-500 bg-green-50'
													: 'border-red-500 bg-red-50'
												: ''
										}`}
										placeholder={`Respuesta para el espacio ${index + 1}`}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{/* If no blanks, show single input */}
				{!hasEmbeddedBlanks && (
					<div className="mt-4">
						<Input
							type="text"
							value={userAnswers[0] || ''}
							onChange={(e) => handleAnswerChange(0, e.target.value)}
							disabled={hasSubmitted}
							className={`w-full ${
								hasSubmitted
									? isCorrect
										? 'border-green-500 bg-green-50'
										: 'border-red-500 bg-red-50'
									: ''
							}`}
							placeholder="Escribe tu respuesta aquí..."
						/>
					</div>
				)}
			</div>

			{exercise.hints && exercise.hints.length > 0 && !hasSubmitted && (
				<div className="rounded-lg bg-blue-50 p-4">
					<h4 className="mb-2 font-medium text-blue-900">💡 Pistas:</h4>
					<ul className="list-inside list-disc space-y-1 text-blue-800 text-sm">
						{exercise.hints.map((hint: string, hintIndex: number) => (
							<li key={`hint-${hint.slice(0, 10)}-${hintIndex}`}>{hint}</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex gap-3">
				{!hasSubmitted ? (
					<Button
						onClick={handleSubmit}
						disabled={
							userAnswers.some((answer) => !answer.trim()) ||
							submitExercise.isPending
						}
						className="min-w-32"
					>
						{submitExercise.isPending ? 'Enviando...' : 'Verificar respuesta'}
					</Button>
				) : (
					<>
						{!isCompleted && (
							<Button
								onClick={handleReset}
								variant="outline"
								className="min-w-32"
							>
								Intentar de nuevo
							</Button>
						)}
						{isCompleted && (
							<div className="flex items-center gap-2 text-green-600 text-sm">
								<CheckCircle2Icon className="h-4 w-4" />
								<span>Ejercicio completado correctamente</span>
							</div>
						)}
					</>
				)}
			</div>

			{hasSubmitted && (
				<Alert
					className="bg-muted/50"
					variant={isCorrect ? 'default' : 'destructive'}
				>
					{isCorrect ? <CheckCircle2Icon /> : <AlertCircleIcon />}
					<AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
					<AlertDescription>
						<p>
							{isCorrect
								? hasEmbeddedBlanks
									? 'Has completado correctamente todos los espacios en blanco.'
									: 'Tu respuesta es correcta.'
								: hasEmbeddedBlanks
									? `Las respuestas correctas son: ${correctAnswers.join(', ')}`
									: `La respuesta correcta es: ${correctAnswers[0]}`}
						</p>
					</AlertDescription>
				</Alert>
			)}

			{showExplanation && exercise.explanation && (
				<Alert className="bg-muted/50">
					<LightbulbIcon />
					<AlertDescription className="ml-2">
						<strong className="text-primary">Explicación:</strong>{' '}
						{exercise.explanation}
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}

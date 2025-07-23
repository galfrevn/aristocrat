import type { Exercise } from '@aristocrat/database/schema';
import { AlertCircleIcon, CheckCircle2Icon, LightbulbIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Markdown } from '@/components/ui/markdown';

interface FillInBlankExerciseProps {
	exercise: Exercise;
	isCompleted: boolean;
	onComplete: () => void;
}

export function FillInBlankExercise({
	exercise,
	isCompleted,
	onComplete,
}: FillInBlankExerciseProps) {
	const [userAnswers, setUserAnswers] = useState<string[]>([]);
	const [hasSubmitted, setHasSubmitted] = useState(isCompleted);
	const [showExplanation, setShowExplanation] = useState(isCompleted);

	// Count blanks in the question
	const blankPattern = /___+|\{blank\}/g;
	const blanks = exercise.question.match(blankPattern) || [];
	const hasEmbeddedBlanks = blanks.length > 0;
	const totalInputs = hasEmbeddedBlanks ? blanks.length : 1;

	// Initialize answers array if empty
	useEffect(() => {
		if (userAnswers.length === 0) {
			setUserAnswers(new Array(totalInputs).fill(''));
		}
	}, [totalInputs, userAnswers.length]);

	const handleAnswerChange = (index: number, value: string) => {
		const newAnswers = [...userAnswers];
		newAnswers[index] = value;
		setUserAnswers(newAnswers);
	};

	const handleSubmit = () => {
		if (userAnswers.some((answer) => !answer.trim())) return;

		setHasSubmitted(true);
		setShowExplanation(true);

		// Check if answers are correct
		const correctAnswers = exercise.correctAnswer.split('|');
		const isCorrect = userAnswers.every((answer, index) => {
			const correctAnswer = correctAnswers[index] || correctAnswers[0]; // Fallback to first answer if only one provided
			const userAnswer = answer.trim().toLowerCase();
			const expectedAnswer = correctAnswer.trim().toLowerCase();

			if (exercise.validationRegex) {
				try {
					const cleanPattern = exercise.validationRegex.replace(
						/^\(\?\w+\)/,
						'',
					);
					const regex = new RegExp(cleanPattern, 'i');
					return regex.test(answer.trim());
				} catch (error) {
					console.warn(
						'Invalid regex pattern:',
						exercise.validationRegex,
						error,
					);
					return false;
				}
			}

			return userAnswer === expectedAnswer;
		});

		if (isCorrect) {
			onComplete();
		}
	};

	const handleReset = () => {
		setUserAnswers(new Array(totalInputs).fill(''));
		setHasSubmitted(false);
		setShowExplanation(false);
	};

	const correctAnswers = exercise.correctAnswer.split('|');
	const isCorrect =
		hasSubmitted &&
		userAnswers.every((answer, index) => {
			const correctAnswer = correctAnswers[index] || correctAnswers[0]; // Fallback to first answer if only one provided
			const userAnswer = answer.trim().toLowerCase();
			const expectedAnswer = correctAnswer.trim().toLowerCase();

			if (exercise.validationRegex) {
				try {
					const cleanPattern = exercise.validationRegex.replace(
						/^\(\?\w+\)/,
						'',
					);
					const regex = new RegExp(cleanPattern, 'i');
					return regex.test(answer.trim());
				} catch (error) {
					console.warn(
						'Invalid regex pattern:',
						exercise.validationRegex,
						error,
					);
					return false;
				}
			}

			return userAnswer === expectedAnswer;
		});

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
						{exercise.hints.map((hint, hintIndex) => (
							<li key={`hint-${hint.slice(0, 10)}-${hintIndex}`}>{hint}</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex gap-3">
				{!hasSubmitted ? (
					<Button
						onClick={handleSubmit}
						disabled={userAnswers.some((answer) => !answer.trim())}
						className="min-w-32"
					>
						Verificar respuesta
					</Button>
				) : (
					<Button onClick={handleReset} variant="outline" className="min-w-32">
						Intentar de nuevo
					</Button>
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

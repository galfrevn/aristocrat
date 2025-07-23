import type { Exercise } from '@aristocrat/database/schema';
import { AlertCircleIcon, CheckCircle2Icon, LightbulbIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLatestExerciseResponse, useSubmitExercise } from '@/hooks/progress';

interface MultipleChoiceExerciseProps {
	exercise: Exercise;
}

export function MultipleChoiceExercise({
	exercise,
}: MultipleChoiceExerciseProps) {
	const [selectedOption, setSelectedOption] = useState<string>('');
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);

	const { data: latestResponse } = useLatestExerciseResponse(exercise.id);
	const submitExercise = useSubmitExercise();

	// Load previous response on component mount
	useEffect(() => {
		if (latestResponse) {
			setSelectedOption(latestResponse.userAnswer);
			setHasSubmitted(true);
			setShowExplanation(true);
		}
	}, [latestResponse]);

	const handleSubmit = async () => {
		if (!selectedOption) return;

		const selectedOptionData = exercise.options?.find(
			(opt) => opt.id === selectedOption,
		);

		if (!selectedOptionData) return;

		const isCorrect = selectedOptionData.isCorrect;
		const pointsEarned = isCorrect ? exercise.points || 10 : 0;

		await submitExercise.mutateAsync({
			exerciseId: exercise.id,
			userAnswer: selectedOption,
			isCorrect,
			pointsEarned,
		});

		setHasSubmitted(true);
		setShowExplanation(true);
	};

	const handleReset = () => {
		setSelectedOption('');
		setHasSubmitted(false);
		setShowExplanation(false);
	};

	const selectedOptionData = exercise.options?.find(
		(opt) => opt.id === selectedOption,
	);
	const isCorrect = selectedOptionData?.isCorrect || false;
	const isCompleted = latestResponse?.isCorrect || false;

	return (
		<div className="space-y-6">
			<div>
				<h3 className="mb-4 font-medium text-lg">{exercise.question}</h3>
			</div>

			<RadioGroup onValueChange={setSelectedOption}>
				{exercise.options?.map((option) => {
					let optionClassName =
						'flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors';

					if (hasSubmitted) {
						if (option.isCorrect) {
							optionClassName += ' border-green-200 bg-green-50';
						} else if (option.id === selectedOption && !option.isCorrect) {
							optionClassName += ' border-red-200 bg-red-50';
						} else {
							optionClassName += ' border-muted bg-muted/30';
						}
					} else {
						optionClassName +=
							' border-muted hover:border-muted-foreground hover:bg-muted/50';
						if (option.id === selectedOption) {
							optionClassName += ' border-primary bg-primary/5';
						}
					}

					return (
						<div
							key={option.id}
							className="flex items-center gap-3 rounded-xl border bg-muted/50 p-5"
						>
							<RadioGroupItem
								id={option.id}
								value={option.id}
								disabled={hasSubmitted}
								checked={selectedOption === option.id}
							/>
							<Label htmlFor={option.id}>{option.text}</Label>
						</div>
					);
				})}
			</RadioGroup>

			<div className="flex gap-3">
				{!hasSubmitted ? (
					<Button
						onClick={handleSubmit}
						disabled={!selectedOption || submitExercise.isPending}
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
								? 'Has seleccionado la respuesta correcta.'
								: `La respuesta correcta es: ${exercise.correctAnswer}`}
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

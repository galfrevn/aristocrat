import type { Exercise } from '@aristocrat/database/schema';
import { AlertCircleIcon, CheckCircle2Icon, LightbulbIcon } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MultipleChoiceExerciseProps {
	exercise: Exercise;
	isCompleted: boolean;
	onComplete: () => void;
}

export function MultipleChoiceExercise({
	exercise,
	isCompleted,
	onComplete,
}: MultipleChoiceExerciseProps) {
	const [selectedOption, setSelectedOption] = useState<string>('');
	const [hasSubmitted, setHasSubmitted] = useState(isCompleted);
	const [showExplanation, setShowExplanation] = useState(isCompleted);

	const handleSubmit = () => {
		if (!selectedOption) return;

		setHasSubmitted(true);
		setShowExplanation(true);

		const selectedOptionData = exercise.options?.find(
			(opt) => opt.id === selectedOption,
		);
		if (selectedOptionData?.isCorrect) {
			onComplete();
		}
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
						disabled={!selectedOption}
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

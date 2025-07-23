import type { Exercise } from '@aristocrat/database/schema';
import { Editor } from '@monaco-editor/react';
import {
	AlertCircleIcon,
	CheckCircle2Icon,
	CodeIcon,
	LightbulbIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/ui/markdown';
import { useLatestExerciseResponse, useSubmitExercise } from '@/hooks/progress';

interface CodeCompletionExerciseProps {
	exercise: Exercise;
}

export function CodeCompletionExercise({
	exercise,
}: CodeCompletionExerciseProps) {
	const [userCode, setUserCode] = useState<string>('');
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);

	const { data: latestResponse } = useLatestExerciseResponse(exercise.id);
	const submitExercise = useSubmitExercise();

	const parseCodeTemplate = (template: string) => {
		if (!template) {
			return {
				language: 'javascript',
				codeWithBlanks: '',
				placeholder: '// Completa el código aquí',
			};
		}

		try {
			const parsed = JSON.parse(template);
			if (parsed.language && parsed.template) {
				return {
					language: parsed.language,
					codeWithBlanks: parsed.template,
					placeholder: '// Completa aquí',
				};
			}
		} catch {}

		return {
			language: 'javascript',
			codeWithBlanks: template,
			placeholder: '// Completa el código aquí',
		};
	};

	const { language, codeWithBlanks } = parseCodeTemplate(
		exercise.codeTemplate || '',
	);

	useEffect(() => {
		if (!userCode && codeWithBlanks) {
			setUserCode(codeWithBlanks);
		}
	}, [codeWithBlanks, userCode]);

	useEffect(() => {
		if (latestResponse) {
			setUserCode(latestResponse.userAnswer);
			setHasSubmitted(true);
			setShowExplanation(true);
		}
	}, [latestResponse]);

	const validateCode = (code: string): boolean => {
		if (!code.trim()) return false;

		if (exercise.validationRegex) {
			const originalTemplate = codeWithBlanks;
			const blankPattern = /___+/g;

			if (blankPattern.test(originalTemplate)) {
				const templateParts = originalTemplate.split(/___+/);
				const beforeBlank = templateParts[0] || '';
				const afterBlank = templateParts[1] || '';

				let filledContent = code;
				if (beforeBlank) {
					filledContent = filledContent.replace(beforeBlank, '');
				}
				if (afterBlank) {
					filledContent = filledContent.replace(afterBlank, '');
				}

				const regex = new RegExp(exercise.validationRegex, 'i');
				return regex.test(filledContent.trim());
			}

			const regex = new RegExp(exercise.validationRegex, 'i');
			return regex.test(code.trim());
		}

		const expectedCode = exercise.correctAnswer.toLowerCase();
		const userCodeLower = code.toLowerCase();

		const expectedKeywords = expectedCode
			.split(/[\s\n\r]+/)
			.filter(
				(word) =>
					word.length > 2 &&
					!['var', 'let', 'const', 'function', 'return'].includes(word),
			);

		const matchedKeywords = expectedKeywords.filter((keyword) =>
			userCodeLower.includes(keyword),
		);

		return matchedKeywords.length >= Math.ceil(expectedKeywords.length * 0.7);
	};

	const handleSubmit = async () => {
		if (!userCode.trim()) return;

		const isCorrect = validateCode(userCode);
		const pointsEarned = isCorrect ? exercise.points || 10 : 0;

		await submitExercise.mutateAsync({
			exerciseId: exercise.id,
			userAnswer: userCode,
			isCorrect,
			pointsEarned,
		});

		setHasSubmitted(true);
		setShowExplanation(true);
	};

	const handleReset = () => {
		setUserCode(codeWithBlanks);
		setHasSubmitted(false);
		setShowExplanation(false);
	};

	const isCorrect = hasSubmitted && validateCode(userCode);
	const isCompleted = latestResponse?.isCorrect || false;

	return (
		<div className="space-y-6">
			<div>
				<div className="mb-4 flex items-center gap-2 font-medium text-lg">
					<CodeIcon className="h-5 w-5" />
					<span>Completa el código:</span>
				</div>
				<Markdown content={exercise.question} />
			</div>

			<div className="space-y-4">
				<div className="overflow-hidden rounded-lg border">
					<Editor
						height="300px"
						language={language}
						value={userCode}
						onChange={(value) => setUserCode(value || '')}
						theme="vs-light"
						options={{
							readOnly: hasSubmitted,
							minimap: { enabled: false },
							fontSize: 16,
							lineHeight: 1.5,
							lineNumbers: 'on',
							scrollBeyondLastLine: false,
							wordWrap: 'on',
							automaticLayout: true,
							fontFamily: 'var(--font-mono)',
							tabSize: 2,
							insertSpaces: true,
							bracketPairColorization: {
								enabled: true,
							},
							fontLigatures: true,
							suggest: {
								showKeywords: true,
								showSnippets: true,
							},
						}}
					/>
				</div>

				<div className="text-muted-foreground text-sm">
					{userCode.split('\n').length} líneas, {userCode.length} caracteres
				</div>
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
						disabled={!userCode.trim() || submitExercise.isPending}
						className="min-w-32"
					>
						{submitExercise.isPending ? 'Verificando...' : 'Verificar código'}
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
					<AlertTitle>
						{isCorrect ? '¡Código correcto!' : 'Código incorrecto'}
					</AlertTitle>
					<AlertDescription>
						<div className="space-y-2">
							<p>
								{isCorrect
									? 'Tu código cumple con los requisitos del ejercicio.'
									: 'Tu código no cumple con todos los requisitos. Revisa la solución esperada.'}
							</p>
							{!isCorrect && (
								<div className="mt-3">
									<p className="mb-2 font-medium">Solución esperada:</p>
									<pre className="overflow-auto rounded bg-slate-100 p-2 font-mono text-sm">
										{exercise.correctAnswer}
									</pre>
								</div>
							)}
						</div>
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

'use client';

import z from 'zod/v4';

import { useForm } from '@tanstack/react-form';

import {
	SmoothModalBody,
	SmoothModalFooter,
	SmoothTabContent,
	SmoothTabs,
	SmoothTabsNavigation,
} from '@/components/ui/modal';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { YouTubePlayer } from '@/components/ui/youtube';

import {
	type CourseGenerationStep,
	type CourseGenerationLanguage,
	type CourseGenerationDifficulty,
	getCourseGenerationStepValidator,
	courseGenerationAvailableLanguages,
	courseGenerationDifficulties,
	courseGenenerationDifficultyWordings,
} from '@/app/dashboard/courses/components/generator/steps';

import { validateYouTubeInput } from '@/utils/youtube';
import { Checkbox } from '@/components/ui/checkbox';

const courseGenerationFormDefaultValues = {
	youtubeVideoId: '',
	language: courseGenerationAvailableLanguages[0] as CourseGenerationLanguage,
	shouldIncludeAssessment: true,
	difficulty: 'medium' as CourseGenerationDifficulty,
};

const courseGenerationFormValidators = {
	onSubmit: z.object({
		youtubeVideoId: z.string().refine(validateYouTubeInput, {
			message: 'El enlace de YouTube no es válido',
		}),
		language: z.enum(courseGenerationAvailableLanguages, {
			message: 'Por favor, selecciona un idioma válido',
		}),
		shouldIncludeAssessment: z.boolean(),
		difficulty: z.enum(courseGenerationDifficulties, {
			message: 'Por favor, selecciona una dificultad válida',
		}),
	}),
};

interface CourseGenerationFormValues {
	availableSteps: Array<CourseGenerationStep>;
	currentStep: CourseGenerationStep;
	setCurrentStep: (step: CourseGenerationStep) => void;
}

export const AristocratCourseGenerationForm = ({
	availableSteps,
	currentStep,
	setCurrentStep,
}: CourseGenerationFormValues) => {
	const courseGeneartionFormInstance = useForm({
		defaultValues: courseGenerationFormDefaultValues,
		validators: courseGenerationFormValidators,
		onSubmit: async ({ value }) => {},
	});

	const handleSubmitCourseGenerationForm = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		void courseGeneartionFormInstance.handleSubmit();
	};

	courseGeneartionFormInstance.validateField('youtubeVideoId', 'change');

	const onValidateStep = (currentStep: CourseGenerationStep) =>
		getCourseGenerationStepValidator(currentStep, courseGeneartionFormInstance);

	return (
		<>
			<SmoothModalBody>
				<SmoothTabs value={currentStep} onValueChange={setCurrentStep}>
					<SmoothTabContent value="input">
						<courseGeneartionFormInstance.Subscribe>
							{(field) => (
								<>
									{field.values.youtubeVideoId &&
										validateYouTubeInput(field.values.youtubeVideoId) && (
											<YouTubePlayer
												className="mb-4"
												expandButtonClassName="hidden"
												videoId={field.values.youtubeVideoId}
											/>
										)}
								</>
							)}
						</courseGeneartionFormInstance.Subscribe>
						<courseGeneartionFormInstance.Field name="youtubeVideoId">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>URL del video de YouTube</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										placeholder="https://youtu.be/dQw4w9WgXcQ"
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											key={error?.message}
											className="text-destructive text-xs"
										>
											{error?.message}
										</p>
									))}

									<div className="mt-3 rounded-lg bg-muted p-4">
										<h4 className="mb-2 font-medium text-sm">
											Formatos soportados:
										</h4>
										<ul className="space-y-0.5 text-muted-foreground text-xs">
											<li>
												<b>URL:</b> https://youtube.com/watch?v=dQw4w9WgXcQ
											</li>
											<li>
												<b>Short:</b> https://youtu.be/dQw4w9WgXcQ
											</li>
											<li>
												<b>Solo Id:</b> dQw4w9WgXcQ
											</li>
										</ul>
									</div>
								</div>
							)}
						</courseGeneartionFormInstance.Field>
					</SmoothTabContent>
					<SmoothTabContent value="language">
						<courseGeneartionFormInstance.Field name="language">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Idioma deseado</Label>
									<Select
										value={field.state.value}
										onValueChange={(value: CourseGenerationLanguage) =>
											field.handleChange(value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Elige un idioma" />
										</SelectTrigger>
										<SelectContent>
											{courseGenerationAvailableLanguages.map((language) => (
												<SelectItem key={language} value={language}>
													{language.charAt(0).toUpperCase() + language.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{field.state.meta.errors.map((error) => (
										<p
											key={error?.message}
											className="text-destructive text-xs"
										>
											{error?.message}
										</p>
									))}

									<div className="mt-3 rounded-lg bg-muted p-4 text-muted-foreground text-sm">
										Nuestra IA generará contenido del curso en el idioma
										seleccionado, haciendo el aprendizaje accesible
										independientemente del idioma original del video.
									</div>
								</div>
							)}
						</courseGeneartionFormInstance.Field>
					</SmoothTabContent>
					<SmoothTabContent value="settings">
						<courseGeneartionFormInstance.Field name="difficulty">
							{(field) => (
								<div className="mb-6 space-y-2">
									<Label htmlFor={field.name}>
										Nivel de dificultad deseado
									</Label>
									<Select
										value={field.state.value}
										onValueChange={(value: CourseGenerationDifficulty) =>
											field.handleChange(value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Elige un idioma" />
										</SelectTrigger>
										<SelectContent>
											{courseGenerationDifficulties.map((difficulty) => (
												<SelectItem key={difficulty} value={difficulty}>
													{courseGenenerationDifficultyWordings[difficulty]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}
						</courseGeneartionFormInstance.Field>
						<courseGeneartionFormInstance.Field name="shouldIncludeAssessment">
							{(field) => (
								<div className="flex items-start gap-3">
									<Checkbox
										id="shouldIncludeAssessment"
										checked={field.state.value}
										onCheckedChange={(value) =>
											field.handleChange(value as boolean)
										}
									/>
									<div className="grid gap-1">
										<Label htmlFor="shouldIncludeAssessment">
											Incluir examen final de conceptos generales.
										</Label>
										<p className="text-muted-foreground text-sm">
											Se incluirá una evaluación de conceptos para medir el
											aprendizaje. No se puede modificar despues.
										</p>
									</div>
								</div>
							)}
						</courseGeneartionFormInstance.Field>
					</SmoothTabContent>
				</SmoothTabs>
			</SmoothModalBody>
			<SmoothModalFooter>
				<SmoothTabs value={currentStep} onValueChange={setCurrentStep}>
					<SmoothTabsNavigation<CourseGenerationStep>
						tabs={availableSteps}
						previousLabel="Atrás"
						onValidateStep={onValidateStep}
						nextLabel={
							currentStep === 'settings' ? 'Generar curso' : 'Siguiente'
						}
					/>
				</SmoothTabs>
			</SmoothModalFooter>
		</>
	);
};

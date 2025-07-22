export const courseGenerationSteps = ['input', 'language', 'settings'] as const;
export type CourseGenerationStep = (typeof courseGenerationSteps)[number];

export const courseGenerationAvailableLanguages = [
	'español',
	'inglés',
	'portugués',
	'francés',
	'alemán',
	'italiano',
	'japonés',
	'chino',
	'ruso',
] as const;

export const availableLanguagesMap = {
	español: 'es',
	inglés: 'en',
	portugués: 'pt',
	francés: 'fr',
	alemán: 'de',
	italiano: 'it',
	japonés: 'ja',
	chino: 'zh',
	ruso: 'ru',
};

export const courseGenerationDifficulties = ['easy', 'medium', 'hard'] as const;
export type CourseGenerationDifficulty =
	(typeof courseGenerationDifficulties)[number];

export type CourseGenerationLanguage =
	(typeof courseGenerationAvailableLanguages)[number];

export const courseGenerationDifficultyWordings = {
	medium: 'Intermedio',
	hard: 'Avanzado',
	easy: 'Fácil',
};

type FormFieldName =
	| 'youtubeVideoId'
	| 'language'
	| 'shouldIncludeAssessment'
	| 'difficulty';

interface FormInstance {
	validateField: <TField extends FormFieldName>(
		field: TField,
		cause: 'change' | 'blur' | 'submit',
	) => unknown[] | Promise<unknown[]>;
}

type StepValidator = (formInstance: FormInstance) => Promise<boolean> | boolean;

const courseGenerationInputStepValidator = async (
	formInstance: FormInstance,
): Promise<boolean> => {
	const errors = await formInstance.validateField('youtubeVideoId', 'submit');
	return Array.isArray(errors) ? errors.length === 0 : !errors;
};

const courseGenerationLanguageStepValidator = async (
	formInstance: FormInstance,
): Promise<boolean> => {
	const errors = await formInstance.validateField('language', 'submit');
	return Array.isArray(errors) ? errors.length === 0 : !errors;
};

const courseGenerationSettingsStepValidator = async (
	formInstance: FormInstance,
): Promise<boolean> => {
	// For settings step, validate all fields in that step
	const difficultyErrors = await formInstance.validateField(
		'difficulty',
		'submit',
	);
	const assessmentErrors = await formInstance.validateField(
		'shouldIncludeAssessment',
		'submit',
	);
	const difficultyValid = Array.isArray(difficultyErrors)
		? difficultyErrors.length === 0
		: !difficultyErrors;
	const assessmentValid = Array.isArray(assessmentErrors)
		? assessmentErrors.length === 0
		: !assessmentErrors;
	return difficultyValid && assessmentValid;
};

type CourseGenerationFormValidators = Record<
	CourseGenerationStep,
	StepValidator
>;

const courseGenerationStepsValidators: CourseGenerationFormValidators = {
	input: (formInstance) => courseGenerationInputStepValidator(formInstance),
	language: (formInstance) =>
		courseGenerationLanguageStepValidator(formInstance),
	settings: (formInstance) =>
		courseGenerationSettingsStepValidator(formInstance),
};

export const getCourseGenerationStepValidator = (
	step: CourseGenerationStep,
	formInstance: FormInstance,
): Promise<boolean> | boolean =>
	courseGenerationStepsValidators[step](formInstance);

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

export const courseGenerationDifficulties = ['easy', 'medium', 'hard'] as const;
export type CourseGenerationDifficulty =
	(typeof courseGenerationDifficulties)[number];

export type CourseGenerationLanguage =
	(typeof courseGenerationAvailableLanguages)[number];

export const courseGenenerationDifficultyWordings = {
	medium: 'Intermedio',
	hard: 'Avanzado',
	easy: 'Fácil',
};

type StepValidator = (formInstance: any) => Promise<boolean> | boolean;

const courseGenerationInputStepValidator = async (formInstance: any) => {
	const errors = await formInstance.validateField('youtubeVideoId', 'submit');
	return errors.length === 0;
};

const courseGenerationLanguageStepValidator = async (formInstance: any) => {
	const errors = await formInstance.validateField('language', 'submit');
	return errors.length === 0;
};

const courseGenerationSettingsStepValidator = async (formInstance: any) => {
	// For settings step, validate all fields in that step
	const difficultyErrors = await formInstance.validateField('difficulty', 'submit');
	const assessmentErrors = await formInstance.validateField('shouldIncludeAssessment', 'submit');
	return difficultyErrors.length === 0 && assessmentErrors.length === 0;
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
	formInstance: any,
) => courseGenerationStepsValidators[step](formInstance);

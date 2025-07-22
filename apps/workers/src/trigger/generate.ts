import {
	AssessmentsRepository,
	ChaptersRepository,
	CoursesRepository,
	database,
	ExercisesRepository,
	LessonsRepository,
} from '@aristocrat/database';
import { logger, metadata, runs, task } from '@trigger.dev/sdk/v3';
import { INVALID_CONTENT, STEP } from '@/tools/steps';
import {
	prepareTranscriptForAi,
	TranscripterService,
} from '@/tools/transcripter';
import { assessmentGenerationJob } from '@/trigger/assessment';
import {
	courseCategorizationJob,
	describeCourseJob,
} from '@/trigger/categorization';
import { courseChaptersGenerationJob } from '@/trigger/chapters';
import { keyConceptsResearchJob } from '@/trigger/concepts';
import { exercisesGenerationJob } from '@/trigger/exercises';
import { lessonsGenerationJob } from '@/trigger/lessons';
import { courseValidationJob } from '@/trigger/validate';

export const COURSE_GENERATION_JOB_MAX_DURATION = 300;
export const COURSE_GENERATION_JOB_ID = 'course:generation';
export const COURSE_GENERATION_JOB_DESCRIPTION =
	'Start processing a youtube video to generate a dynamic course using optimized AI techniques.';

type CourseGenerationJobPayload = {
	videoId: string;
	userId: string;
	courseId: string;
	language: string;
	difficulty: string;
};

export const courseGenerationJob = task({
	id: COURSE_GENERATION_JOB_ID,
	maxDuration: COURSE_GENERATION_JOB_MAX_DURATION,
	description: COURSE_GENERATION_JOB_DESCRIPTION,
	run: async (payload: CourseGenerationJobPayload, { ctx }) => {
		// AI Course generation starts here

		// Generation step #1
		// Read and translate the transcript into a structured format
		metadata.set('status', 'processing_transcript');
		logger.info('Staring transcript search', {
			videoId: payload.videoId,
		});

		const transcriptionService = new TranscripterService();
		const transcript = await transcriptionService.extractTranscript(
			payload.videoId,
			payload.language,
		);

		// Initialize repositories
		const chaptersRepository = new ChaptersRepository(database);
		const lessonsRepository = new LessonsRepository(database);
		const exercisesRepository = new ExercisesRepository(database);
		const assessmentsRepository = new AssessmentsRepository(database);
		const coursesRepository = new CoursesRepository(database);

		// Verify course exists before proceeding
		const course = await coursesRepository.get(payload.courseId);
		if (!course) {
			throw new Error(`Course with ID ${payload.courseId} not found`);
		}

		// Generation step #2
		// Checks if the transcript is valid for course generation
		// We want just transcript of tutorials or content that can be used to generate a course
		// If not, it will explain why and return the error.
		const courseValidationJobResponse =
			await courseValidationJob.triggerAndWait({
				transcript: prepareTranscriptForAi(transcript, { maximumSegments: 75 }),
			});

		if (!courseValidationJobResponse.ok) {
			throw new Error('Failed to validate course');
		}

		// If the content is not valid => cancel the run.
		// #TODO: Research how can we edit the videoId and regenerate the task.
		if (!courseValidationJobResponse.output.valid) {
			metadata.set(STEP, INVALID_CONTENT);

			runs.cancel(ctx.run.id);
		}

		// Generation step #2.5
		// Categorize the course based on the transcript and metadata
		// Attach the category and tags to the course
		await courseCategorizationJob.trigger({
			course,
			transcript: transcript.transcript,
			language: payload.language,
		});

		// Generation step #2.5.1
		// Describe the course based on the transcript and metadata
		// Attach the description to the course
		await describeCourseJob.trigger({
			course,
			transcript: transcript.transcript,
			language: payload.language,
		});

		// Generation step #3
		// Process the transcript and generate chapters.
		const courseChaptersGenerationJobResponse =
			await courseChaptersGenerationJob.triggerAndWait({
				transcript: transcript.transcript,
				language: payload.language,
			});

		if (!courseChaptersGenerationJobResponse.ok) {
			throw new Error('Failed to generate chapters');
		}

		const chaptersInDatabase = await chaptersRepository.insertMany(
			courseChaptersGenerationJobResponse.output.chapters.map(
				(chapter, index) => ({
					courseId: payload.courseId,
					title: chapter.title,
					description: chapter.description,
					order: index + 1,
				}),
			),
		);

		// Generation step #4
		// Generate lessons content and save lessons using batchTriggerAndWait
		const lessonsGenerationPayloads = chaptersInDatabase.map(
			(chapterInDatabase, chapterIndex) => ({
				payload: {
					transcript: transcript.transcript,
					language: payload.language,
					chapter: {
						...chapterInDatabase,
						lessons:
							courseChaptersGenerationJobResponse.output.chapters[chapterIndex]
								.lessons,
					},
				},
			}),
		);

		const lessonsContentResponses =
			// @ts-ignore
			await lessonsGenerationJob.batchTriggerAndWait(lessonsGenerationPayloads);

		// Process results and save lessons to database
		const chaptersWithLessonsInDatabase = await Promise.all(
			lessonsContentResponses.runs.map(
				async (lessonsContentResponse, index) => {
					if (!lessonsContentResponse.ok) {
						throw new Error(
							`Failed to generate lessons for chapter ${chaptersInDatabase[index].id}`,
						);
					}

					const chapterInDatabase = chaptersInDatabase[index];
					const chapterWithLessons = {
						...chapterInDatabase,
						lessons:
							courseChaptersGenerationJobResponse.output.chapters[index]
								.lessons,
					};

					// Save lessons to database
					const lessonsInDatabase = await lessonsRepository.insertMany(
						lessonsContentResponse.output.lessons.map(
							(lesson, lessonIndex) => ({
								chapterId: chapterInDatabase.id,
								title: lesson.title,
								description: lesson.description,
								content: lesson.content,
								keyConcepts: lesson.keyConcepts || [],
								startTime: chapterWithLessons.lessons[lessonIndex].startTime,
								endTime: chapterWithLessons.lessons[lessonIndex].endTime,
								type: 'text' as const,
								order: lessonIndex + 1,
							}),
						),
					);

					return { chapter: chapterInDatabase, lessons: lessonsInDatabase };
				},
			),
		);

		// Generation step #5
		// Research key concepts for all lessons using batchTriggerAndWait
		const keyConceptsResearchPayloads = chaptersWithLessonsInDatabase.flatMap(
			({ lessons }) =>
				lessons
					.filter(
						(lesson) => lesson.keyConcepts && lesson.keyConcepts.length > 0,
					)
					.map((lesson) => ({
						payload: {
							lesson,
							language: payload.language,
						},
					})),
		);

		const researchedLessons = [...chaptersWithLessonsInDatabase];

		if (keyConceptsResearchPayloads.length > 0) {
			const keyConceptsResponses =
				await keyConceptsResearchJob.batchTriggerAndWait(
					keyConceptsResearchPayloads,
				);

			// Update lessons with researched concepts
			let payloadIndex = 0;
			for (const chapterData of researchedLessons) {
				for (let i = 0; i < chapterData.lessons.length; i++) {
					const lesson = chapterData.lessons[i];
					if (lesson.keyConcepts && lesson.keyConcepts.length > 0) {
						const researchResponse = keyConceptsResponses.runs[payloadIndex];
						payloadIndex++;

						if (researchResponse.ok) {
							// Update lesson with researched concepts
							const updatedKeyConcepts = lesson.keyConcepts.map(
								(concept, conceptIndex) => ({
									...concept,
									researchedContent:
										researchResponse.output.concepts[conceptIndex]
											?.researchedContent || '',
									references:
										researchResponse.output.concepts[conceptIndex]
											?.references || [],
								}),
							);

							await lessonsRepository.update(lesson.id, {
								keyConcepts: updatedKeyConcepts,
							});

							// Update local copy
							chapterData.lessons[i] = {
								...lesson,
								keyConcepts: updatedKeyConcepts,
							};
						}
					}
				}
			}
		}

		// Generation step #6
		// Generate exercises for all lessons using batchTriggerAndWait
		const exercisesGenerationPayloads = researchedLessons.flatMap(
			({ lessons }) =>
				lessons.map((lesson) => ({
					payload: {
						transcript: transcript.transcript,
						language: payload.language,
						lesson,
					},
				})),
		);

		const exercisesResponses = await exercisesGenerationJob.batchTriggerAndWait(
			exercisesGenerationPayloads,
		);

		// Process results and save exercises to database
		let payloadIndex = 0;
		for (const { lessons } of researchedLessons) {
			for (const lesson of lessons) {
				const exercisesResponse = exercisesResponses.runs[payloadIndex];
				payloadIndex++;

				if (!exercisesResponse.ok) {
					throw new Error(
						`Failed to generate exercises for lesson ${lesson.id}`,
					);
				}

				// Save exercises to database
				await exercisesRepository.insertMany(
					exercisesResponse.output.exercises.map((exercise, exerciseIndex) => ({
						lessonId: lesson.id,
						question: exercise.question,
						type: exercise.type,
						options: exercise.options || [],
						correctAnswer: exercise.correctAnswer,
						explanation: exercise.explanation,
						hint: exercise.hint,
						order: exerciseIndex + 1,
					})),
				);
			}
		}

		// Generation step #6
		// Generate course assessment
		const assessmentResponse = await assessmentGenerationJob.triggerAndWait({
			transcript: transcript.transcript,
			language: payload.language,
			course,
		});

		if (!assessmentResponse.ok) {
			throw new Error('Failed to generate course assessment');
		}

		// Save assessments to database
		await assessmentsRepository.insertMany(
			assessmentResponse.output.assessments.map(
				(assessment, assessmentIndex) => ({
					courseId: payload.courseId,
					question: assessment.question,
					type: assessment.type,
					options: assessment.options || [],
					correctAnswer: assessment.correctAnswer,
					explanation: assessment.explanation,
					hint: assessment.hint,
					points: assessment.points,
					passingScore: assessment.passingScore,
					timeLimit: assessment.timeLimit,
					order: assessmentIndex + 1,
				}),
			),
		);

		logger.info('Course generation completed successfully', {
			courseId: payload.courseId,
			chaptersCount: chaptersInDatabase.length,
		});

		return {
			success: true,
			courseId: payload.courseId,
			chaptersCreated: chaptersInDatabase.length,
		};
	},
});

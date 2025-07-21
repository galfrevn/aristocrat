// Schema exports

export type { Assessment, InsertAssessment } from './assessments';
export { assessments } from './assessments';
export { account, session, user, verification } from './auth';
export { banners } from './banners';
export type { Chapter, InsertChapter } from './chapters';
export { chapters } from './chapters';
// Type exports
export type { Course, InsertCourse } from './courses';
export { courses } from './courses';
export type { Exercise, InsertExercise } from './exercises';
export { exercises } from './exercises';
export type { InsertLesson, Lesson } from './lessons';
export { lessons } from './lessons';
export type { InsertNote, Note } from './notes';
export { notes } from './notes';
export type {
	AssessmentResponse,
	ChapterProgress,
	CourseProgress,
	ExerciseResponse,
	InsertAssessmentResponse,
	InsertChapterProgress,
	InsertCourseProgress,
	InsertExerciseResponse,
	InsertLessonProgress,
	LessonProgress,
} from './progress';
export {
	assessmentResponses,
	chapterProgress,
	courseProgress,
	exerciseResponses,
	lessonProgress,
} from './progress';

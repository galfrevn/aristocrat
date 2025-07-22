import { drizzle } from 'drizzle-orm/node-postgres';

import {
	account,
	assessmentResponses,
	assessments,
	banners,
	chapterProgress,
	chapters,
	courseProgress,
	courses,
	exerciseResponses,
	exercises,
	lessonProgress,
	lessons,
	notes,
	session,
	user,
	verification,
} from './schema';

const schema = {
	account,
	user,
	session,
	verification,
	courses,
	banners,
	chapters,
	lessons,
	exercises,
	assessments,
	notes,
	courseProgress,
	chapterProgress,
	lessonProgress,
	exerciseResponses,
	assessmentResponses,
};

export const database = drizzle(process.env.DATABASE_URL || '', {
	schema,
});

export type AristocratDatabase = typeof database;

// Export repository classes
export {
	AssessmentsRepository,
	BannersRepository,
	ChaptersRepository,
	CoursesRepository,
	ExercisesRepository,
	LessonsRepository,
	NotesRepository,
	ProgressRepository,
} from './repository';

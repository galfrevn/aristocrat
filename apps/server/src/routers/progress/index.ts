import { router } from '@/lib/trpc';
import { chapterProgressRouter } from './chapter';
import { courseProgressRouter } from './course';
import { exerciseResponseRouter } from './exercise';
import { lessonProgressRouter } from './lesson';

export const progressRouter = router({
	course: courseProgressRouter,
	chapter: chapterProgressRouter,
	lesson: lessonProgressRouter,
	exercise: exerciseResponseRouter,
});

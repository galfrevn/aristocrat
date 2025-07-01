import { router } from '@/lib/trpc';

import { aristocratCoursesRouter } from '@/routers/courses';

export const aristocratApplicationRouter = router({
	courses: aristocratCoursesRouter,
});

export type AristocratRouter = typeof aristocratApplicationRouter;

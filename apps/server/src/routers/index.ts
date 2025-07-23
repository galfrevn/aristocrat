import { router } from '@/lib/trpc';

import { aristocratBannersRouter } from '@/routers/banners';
import { aristocratCoursesRouter } from '@/routers/courses';
import { progressRouter } from '@/routers/progress';

export const aristocratApplicationRouter = router({
	banners: aristocratBannersRouter,
	courses: aristocratCoursesRouter,
	progress: progressRouter,
});

export type AristocratRouter = typeof aristocratApplicationRouter;

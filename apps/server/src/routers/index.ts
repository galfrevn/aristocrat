import { router } from '@/lib/trpc';

import { aristocratBannersRouter } from '@/routers/banners';
import { aristocratCoursesRouter } from '@/routers/courses';

export const aristocratApplicationRouter = router({
	banners: aristocratBannersRouter,
	courses: aristocratCoursesRouter,
});

export type AristocratRouter = typeof aristocratApplicationRouter;

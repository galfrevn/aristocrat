import { router } from '@/lib/trpc';

import { list } from '@/routers/courses/get/list';

export const aristocratCoursesRouter = router({
	$get: {
		list,
	},
});

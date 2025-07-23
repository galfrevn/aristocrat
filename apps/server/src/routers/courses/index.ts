import { router } from '@/lib/trpc';

import { content } from '@/routers/courses/get/content';
import { exercises } from '@/routers/courses/get/exercises';
import { list } from '@/routers/courses/get/list';
import { search } from '@/routers/courses/get/search';

import { create } from '@/routers/courses/post/create';

export const aristocratCoursesRouter = router({
	$get: {
		list,
		search,
		content,
		exercises,
	},
	$post: {
		create,
	},
});

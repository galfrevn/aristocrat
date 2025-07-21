import { router } from '@/lib/trpc';
import { deleteBanner } from '@/routers/banners/delete/delete';
import { enabled } from '@/routers/banners/get/enabled';
import { list } from '@/routers/banners/get/list';
import { one } from '@/routers/banners/get/one';
import { create } from '@/routers/banners/post/create';
import { disable } from '@/routers/banners/put/disable';
import { enable } from '@/routers/banners/put/enable';
import { update } from '@/routers/banners/put/update';

export const aristocratBannersRouter = router({
	$get: {
		enabled,
		list,
		one,
	},
	$post: {
		create,
	},
	$put: {
		update,
		enable,
		disable,
	},
	$delete: {
		delete: deleteBanner,
	},
});

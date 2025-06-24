import { createRouteHandler } from 'uploadthing/next';
import { aristocratFileRouter } from '@/app/api/uploadthing/core';

export const { GET, POST } = createRouteHandler({
	router: aristocratFileRouter,
});

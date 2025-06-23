import type { Session } from 'better-auth';

import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const aristocratFileRouter = {
	profilePicturesRouter: f({
		image: {
			maxFileSize: '1MB',
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const serverRoute = process.env.NEXT_PUBLIC_SERVER_URL;
			const response = await fetch(`${serverRoute}/api/auth/get-session`, {
				headers: {
					cookie: req.headers.get('cookie') || '',
				},
			});

			const session = (await response.json()) as Session;
			if (!session) throw new UploadThingError('Unauthorized');

			return { userId: session.userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId);
			console.log('file url', file.ufsUrl);

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type AristocratFileRouter = typeof aristocratFileRouter;

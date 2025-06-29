import { Hono } from 'hono';
import { authenticationMiddleware } from '@/middlewares/auth';
import { TranscriptService } from '@/services/transcript';
import type { TranscriptRequest } from '@/types';

const router = new Hono<{ Variables: { userId: string } }>();
const transcriptService = new TranscriptService();

export const aristocratTranscripterCoreRouter = router.post(
	'/extract',
	authenticationMiddleware,
	async (c) => {
		try {
			const { videoId, language = 'es' }: TranscriptRequest =
				await c.req.json();
			const userId = c.get('userId');

			console.log(
				`Authenticated request from user ${userId} for video: ${videoId}`,
			);

			if (!videoId) {
				return c.json({ error: 'videoId is required' }, 400);
			}

			const result = await transcriptService.extractTranscript(
				videoId,
				language,
			);

			return c.json({
				transcript: result.transcript,
				videoId,
				segments: result.segments,
				file: result.file,
			});
		} catch (extractionError) {
			console.error('Transcript extraction failed:', extractionError);
			return c.json(
				{
					error: (extractionError as Error).message,
					videoId: (await c.req.json().catch(() => ({})))?.videoId,
				},
				500,
			);
		}
	},
);

import { database } from '@aristocrat/database';
import { CoursesRepository } from '@aristocrat/database/repository';
import { tasks } from '@trigger.dev/sdk/v3';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '@/lib/trpc';

import {
	getYoutubeInformation,
	getYoutubeVideoIdFromUrl,
} from '@/utils/youtube';

const createCourseSchema = z.object({
	language: z.string(),
	difficulty: z.enum(['easy', 'medium', 'hard']),
	youtubeVideoId: z.string(),
});

export const create = protectedProcedure
	.input(createCourseSchema)
	.mutation(async ({ input, ctx }) => {
		const youtubeVideoId = getYoutubeVideoIdFromUrl(input.youtubeVideoId);
		const youtubeVideoInformation = await getYoutubeInformation(youtubeVideoId);

		if (!youtubeVideoInformation) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Invalid YouTube video ID',
			});
		}

		const coursesRepository = new CoursesRepository(database);
		const course = await coursesRepository.insert({
			userId: ctx.session.user.id,
			youtubeVideoId: youtubeVideoId,
			difficulty: input.difficulty,
			language: input.language,
			title: youtubeVideoInformation.title,
			thumbnail: youtubeVideoInformation.thumbnail_url,
		});

		try {
			const idempotencyKey = `course:${ctx.session.user.id}:${youtubeVideoId}`;
			const courseGenerationJobResponse = await tasks.trigger(
				'course:generation',
				{
					videoId: youtubeVideoId,
					userId: ctx.session.user.id,
					courseId: course.id,
					language: input.language,
					difficulty: input.difficulty,
				},
				{
					idempotencyKey,
					idempotencyKeyTTL: '60s',
				},
			);

			await coursesRepository.update(course.id, {
				generationProcessId: courseGenerationJobResponse.id,
			});

			return {
				success: true,
				startedAt: new Date().toISOString(),
				message: 'Course generation started successfully',
				metadata: {
					courseId: course.id,
					title: course.title,
					jobId: courseGenerationJobResponse.id,
				},
			};
		} catch (error) {
			return {
				success: false,
				startedAt: new Date().toISOString(),
				message: 'Failed to start course generation',
				error: error instanceof Error ? error.message : 'Unknown error',
				metadata: {
					courseId: course.id,
					title: course.title,
				},
			};
		}
	});

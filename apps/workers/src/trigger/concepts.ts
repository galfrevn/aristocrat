import type { Lesson } from '@aristocrat/database/schema';
import { logger, metadata, task } from '@trigger.dev/sdk/v3';
import { researchKeyConceptsFn } from '@/ai/concepts';
import { RESEARCHING_KEY_CONCEPTS, STEP } from '@/tools/steps';

export const KEY_CONCEPTS_RESEARCH_JOB_MAX_DURATION = 120;
export const KEY_CONCEPTS_RESEARCH_JOB_ID = 'concepts:research';
export const KEY_CONCEPTS_RESEARCH_JOB_DESCRIPTION =
	'Research key concepts for a lesson using real-time internet data via Perplexity AI.';

type KeyConceptsResearchJobPayload = {
	lesson: Lesson;
	language: string;
};

export const keyConceptsResearchJob = task({
	id: KEY_CONCEPTS_RESEARCH_JOB_ID,
	maxDuration: KEY_CONCEPTS_RESEARCH_JOB_MAX_DURATION,
	description: KEY_CONCEPTS_RESEARCH_JOB_DESCRIPTION,
	run: async (payload: KeyConceptsResearchJobPayload) => {
		// Updating generation progress
		metadata.set(STEP, RESEARCHING_KEY_CONCEPTS);
		logger.info('Researching key concepts for lesson', {
			lessonId: payload.lesson.id,
			lessonTitle: payload.lesson.title,
			keyConceptsCount: payload.lesson.keyConcepts?.length || 0,
		});

		// Only research if there are key concepts to research
		if (payload.lesson.keyConcepts.length === 0) {
			return { concepts: [] };
		}

		const {
			object: researchKeyConceptsFnResponse,
			usage: researchKeyConceptsFnUsage,
		} = await researchKeyConceptsFn(payload.lesson, payload.language);

		logger.info('Key concepts research completed', {
			lessonId: payload.lesson.id,
			conceptsResearched: researchKeyConceptsFnResponse.concepts.length,
			usage: researchKeyConceptsFnUsage,
		});

		return researchKeyConceptsFnResponse;
	},
});

import { useMemo } from 'react';

/**
 * Utility functions to estimate content length and reading time
 */

// Average reading speeds (words per minute)
const READING_SPEEDS = {
	slow: 150, // Beginner readers
	average: 200, // Most adults
	fast: 250, // Experienced readers
	technical: 100, // Technical/complex content
} as const;

// Average speaking speeds (words per minute)
const SPEAKING_SPEEDS = {
	slow: 120,
	average: 150,
	fast: 180,
	presentation: 130, // For educational content
} as const;

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
	if (!text || typeof text !== 'string') return 0;

	// Remove extra whitespace and split by whitespace
	return text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
}

/**
 * Count characters in a text string (excluding whitespace)
 */
export function countCharacters(text: string, includeSpaces = true): number {
	if (!text || typeof text !== 'string') return 0;

	return includeSpaces ? text.length : text.replace(/\s/g, '').length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(
	text: string,
	speed: keyof typeof READING_SPEEDS = 'average',
): number {
	const wordCount = countWords(text);
	const wordsPerMinute = READING_SPEEDS[speed];

	return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Estimate speaking/video time in minutes
 */
export function estimateSpeakingTime(
	text: string,
	speed: keyof typeof SPEAKING_SPEEDS = 'presentation',
): number {
	const wordCount = countWords(text);
	const wordsPerMinute = SPEAKING_SPEEDS[speed];

	return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Estimate lesson completion time based on content type
 */
export function estimateLessonTime(content: {
	text?: string;
	hasVideo?: boolean;
	hasExercises?: boolean;
	hasQuiz?: boolean;
	exerciseCount?: number;
	quizQuestionCount?: number;
}): {
	readingTime: number;
	totalTime: number;
	breakdown: {
		reading: number;
		video: number;
		exercises: number;
		quiz: number;
	};
} {
	const readingTime = content.text ? estimateReadingTime(content.text) : 0;

	// Estimate additional time for interactive elements
	const videoTime = content.hasVideo
		? estimateSpeakingTime(content.text || '')
		: 0;
	const exerciseTime = (content.exerciseCount || 0) * 2; // 2 minutes per exercise
	const quizTime = (content.quizQuestionCount || 0) * 0.5; // 30 seconds per question

	const totalTime = Math.max(readingTime, videoTime) + exerciseTime + quizTime;

	return {
		readingTime,
		totalTime: Math.ceil(totalTime),
		breakdown: {
			reading: readingTime,
			video: videoTime,
			exercises: exerciseTime,
			quiz: quizTime,
		},
	};
}

/**
 * Format time duration into a human-readable string
 */
export function formatDuration(minutes: number): string {
	if (minutes < 1) return '< 1 min';
	if (minutes < 60) return `${minutes} min`;

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) return `${hours}h`;
	return `${hours}h ${remainingMinutes}m`;
}

/**
 * Get difficulty level based on text complexity
 */
export function estimateContentDifficulty(text: string): {
	level: 'beginner' | 'intermediate' | 'advanced';
	score: number;
	factors: {
		averageWordsPerSentence: number;
		averageCharactersPerWord: number;
		longWordPercentage: number;
	};
} {
	if (!text)
		return {
			level: 'beginner',
			score: 0,
			factors: {
				averageWordsPerSentence: 0,
				averageCharactersPerWord: 0,
				longWordPercentage: 0,
			},
		};

	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);

	const averageWordsPerSentence = words.length / sentences.length;
	const averageCharactersPerWord =
		words.reduce((sum, word) => sum + word.length, 0) / words.length;
	const longWords = words.filter((word) => word.length > 6);
	const longWordPercentage = (longWords.length / words.length) * 100;

	// Simple scoring system (0-100)
	let score = 0;
	score += Math.min(averageWordsPerSentence * 2, 40); // Max 40 points
	score += Math.min(averageCharactersPerWord * 5, 30); // Max 30 points
	score += Math.min(longWordPercentage, 30); // Max 30 points

	let level: 'beginner' | 'intermediate' | 'advanced';
	if (score < 30) level = 'beginner';
	else if (score < 60) level = 'intermediate';
	else level = 'advanced';

	return {
		level,
		score: Math.round(score),
		factors: {
			averageWordsPerSentence: Math.round(averageWordsPerSentence * 10) / 10,
			averageCharactersPerWord: Math.round(averageCharactersPerWord * 10) / 10,
			longWordPercentage: Math.round(longWordPercentage * 10) / 10,
		},
	};
}

interface UseContentEstimationProps {
	text?: string;
	hasVideo?: boolean;
	hasExercises?: boolean;
	hasQuiz?: boolean;
	exerciseCount?: number;
	quizQuestionCount?: number;
}

export function useContentEstimation(props: UseContentEstimationProps) {
	return useMemo(() => {
		if (!props.text) {
			return {
				wordCount: 0,
				readingTime: 0,
				totalTime: 0,
				formattedDuration: '0 min',
				difficulty: {
					level: 'beginner' as const,
					score: 0,
					factors: {
						averageWordsPerSentence: 0,
						averageCharactersPerWord: 0,
						longWordPercentage: 0,
					},
				},
				breakdown: { reading: 0, video: 0, exercises: 0, quiz: 0 },
			};
		}

		const wordCount = countWords(props.text);
		const timeEstimate = estimateLessonTime(props);
		const difficulty = estimateContentDifficulty(props.text);

		return {
			wordCount,
			readingTime: timeEstimate.readingTime,
			totalTime: timeEstimate.totalTime,
			formattedDuration: formatDuration(timeEstimate.totalTime),
			difficulty,
			breakdown: timeEstimate.breakdown,
		};
	}, [
		props.text,
		props.hasVideo,
		props.hasExercises,
		props.hasQuiz,
		props.exerciseCount,
		props.quizQuestionCount,
	]);
}

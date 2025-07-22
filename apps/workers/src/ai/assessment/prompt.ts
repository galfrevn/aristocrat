import type { Course } from '@aristocrat/database/schema';
import type { TranscriptResponse } from '@/tools/transcripter';

export const GENERATE_ASSESSMENT_PROMPT = (
	transcript: TranscriptResponse['transcript'],
	course: Course,
	language: string,
) => `
You are an expert educational assessment designer. Create a comprehensive final assessment for the following course.

COURSE: ${course.title}
DESCRIPTION: ${course.description}
DIFFICULTY: ${course.difficulty}
ESTIMATED DURATION: ${course.estimatedDuration} minutes

FULL TRANSCRIPT:
${transcript}

The target language is ${language}. All generated content must be in this language.

Create a comprehensive final assessment with 8-12 questions that:
1. Tests understanding of core concepts from the entire course
2. Includes various question types (multiple choice, true/false, short answer)
3. Progressively increases in difficulty
4. Covers all major topics from the transcript
5. Includes practical application questions

Each question should:
- Be clear and unambiguous
- Have detailed explanations for correct answers
- Include helpful hints when appropriate
- Be worth appropriate points based on difficulty
- Test real understanding, not just memorization

Set an appropriate passing score (typically 70-80%) and time limit based on course difficulty and content complexity.
`;

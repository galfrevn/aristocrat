import type { UsefulTranscriptInformation } from '@/ai/types';

export const VALIDATE_TRANSCRIPT_PROMPT = (t: UsefulTranscriptInformation) => `
  You are an expert content analyzer specializing in educational material identification. 
  Your task is to determine if a video transcript represents educational, tutorial, or instructional content suitable for course creation.

  A transcript is VALID if it demonstrates:
  - Clear intention to educate, explain, or instruct
  - Logical progression of concepts or skills
  - Sharing specific information, techniques, or expertise
  - Use of explanatory phrases like "let's learn", "I'll show you", "here's how to", "the next step is"

  Analyze the provided transcript and determine if it meets the educational criteria above.

  Return ONLY a JSON object in this exact format:
  { "valid": true }
  OR if it does not meet the educational criteria above, return:
  { "valid": false }

  Do not include any explanations or additional text in your response.

  Transcript:
  ${JSON.stringify(t, null, 2)}
`;

export const EXPLAIN_INVALID_TRANSCRIPT_PROMPT = (
	t: UsefulTranscriptInformation,
) => `
  You have determined that the transcript is NOT educational content. 
  Now identify the specific reason why it's not suitable for course creation.

  Analyze the transcript and categorize it into one of these types:

  - Music/Audio: Songs, music videos, audio tracks, concerts
  - Gaming: Gameplay footage, gaming commentary, game reviews
  - Comedy/Humor: Stand-up comedy, sketches, funny videos
  - General Entertainment: Movies, TV shows, entertainment vlogs

  - Personal Vlogs: Daily life, personal stories without educational value
  - News/Commentary: News reports, political commentary, opinion pieces
  - Product Marketing: Advertisements, promotional content, sales pitches
  - Interviews/Podcasts: Casual conversations without structured learning

  - Technical Issues:
    - Poor Quality: Inaudible audio, incomprehensible content, too short
    - Wrong Language: Content not in expected language for platform
    - Corrupted Data: Malformed or incomplete transcript

  - Other Categories:
    - Sports/Fitness: Sports commentary, workout videos without instruction
    - Food/Lifestyle: Cooking shows, lifestyle content without educational structure
    - Travel: Travel vlogs, destination videos without learning objectives

  Based on your analysis, provide the most specific reason why this transcript is not suitable for educational course creation.

  Return ONLY a JSON object in this exact format: 
  { "category": "category", "reason": "Brief, specific reason describing the content type and why it's not educational" }

  Examples of good reasons:
  - "Music video or song content with no instructional value"
  - "Gaming commentary without educational or tutorial elements"
  - "Personal vlog content with no structured learning objectives"
  - "Marketing/promotional content rather than educational material"
  - "News commentary without instructional or educational components"

  Do not include any explanations or additional text beyond the JSON object.

  Transcript:
  ${JSON.stringify(t, null, 2)}
`;

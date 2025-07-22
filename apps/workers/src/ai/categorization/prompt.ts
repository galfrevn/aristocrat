import type { Course } from '@aristocrat/database/schema';
import type { TranscriptResponse } from '@/tools/transcripter';

export const CATEGORIZE_COURSE_PROMPT = (
	transcript: TranscriptResponse['transcript'],
	course: Course,
	language: string,
) => `
  You are an expert course categorization specialist. 
  Your task is to analyze a course based on its transcript and metadata to determine the most appropriate category and relevant tags.

  COURSE INFORMATION:
  Title: ${course.title}
  Description: ${course.description || 'No description provided'}
  Difficulty: ${course.difficulty}
  Language: ${course.language}

  FULL TRANSCRIPT:
  ${transcript}

  INSTRUCTIONS:
  - Analyze the transcript content to understand the main subject matter and learning objectives
  - Determine the most appropriate single category that best represents the course content
  - Generate 2-5 relevant tags that describe specific topics, skills, or technologies covered

  CATEGORY GUIDELINES:
  Choose the most specific and accurate category from these common educational domains:
  - Programming & Development
  - Web Development
  - Mobile Development
  - Data Science & Analytics
  - Machine Learning & AI
  - Cloud Computing & DevOps
  - Cybersecurity
  - Database Management
  - Software Engineering
  - UI/UX Design
  - Digital Marketing
  - Business & Entrepreneurship
  - Project Management
  - Personal Development
  - Language Learning
  - Mathematics & Statistics
  - Science & Engineering
  - Art & Design
  - Music & Audio
  - Video & Photography
  - Writing & Communication
  - Health & Fitness
  - Cooking & Lifestyle
  - Finance & Investment
  - Education & Teaching
  - Other

  If none of these fit perfectly, create a descriptive category that accurately represents the content.

  TAGS GUIDELINES:
  - Generate 2-5 tags that are specific and relevant
  - Include technologies, frameworks, tools, or methodologies mentioned
  - Include skill levels or specific techniques covered
  - Use common industry terminology
  - Make tags searchable and useful for course discovery
  - Avoid generic words like "basics" or "introduction" unless specifically relevant

  LANGUAGE REQUIREMENT:
  All category and tags must be in ${language} language.

  OUTPUT REQUIREMENTS:
  - Category: Single, descriptive category name
  - Tags: Array of 2-5 specific, relevant tags
  - All content must be in the target language
  - Focus on accuracy and usefulness for course discovery

  Return a JSON object with the category and tags based on the course content analysis.
`;

export const DESCRIBE_COURSE_PROMPT = (
	transcript: TranscriptResponse['transcript'] | null,
	courseTitle: string,
	language: string,
) => `
  You are an expert course description specialist. 
  Your task is to analyze a course and generate the most appropriate description.

  COURSE TITLE: ${courseTitle}

  ${
		transcript
			? `
  FULL TRANSCRIPT:
  ${transcript}

  INSTRUCTIONS:
  - Analyze the transcript content to understand the main subject matter and learning objectives
  - Use the course title as additional context for accuracy
  - Generate a comprehensive description that accurately represents the course content
  - Focus on clarity and usefulness for course discovery
  `
			: `
  INSTRUCTIONS (FALLBACK MODE - No transcript available):
  - Use the course title to infer the subject matter and potential learning objectives
  - Generate a reasonable description based on what the title suggests the course covers
  - Make educated assumptions about typical content for this type of course
  - Keep the description general but informative
  `
	}

  LANGUAGE REQUIREMENT:
  All content must be in ${language} language.

  OUTPUT REQUIREMENTS:
  - Description: Single, descriptive description of the course content (2-3 sentences)
  - All content must be in the target language
  - Focus on accuracy and usefulness for course discovery
  - Make it engaging and informative for potential learners

  ${
		transcript
			? 'PRIORITY: Use transcript content as the primary source, with course title as supporting context.'
			: 'PRIORITY: Generate a meaningful description based on course title analysis and typical course expectations.'
	}

  Return a JSON object with the description field containing your generated course description.
`;

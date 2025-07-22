import type { Lesson } from '@aristocrat/database/schema';
import type { TranscriptResponse } from '@/tools/transcripter';

export const GENERATE_EXERCISES_PROMPT = (
	transcript: TranscriptResponse['transcript'],
	lesson: Lesson,
	language: string,
) => `
	You are an expert educator and exercise creator.
	Your task is to generate interactive exercises for the provided lesson.
	You will receive a lesson with a title, description, content, and key concepts.
	For the lesson, you will create exercises that reinforce the learning objectives and concepts covered in the lesson.

	Transcript:
	${transcript}

	INSTRUCTIONS:
	- For the lesson, analyze the title, description, content, and key concepts provided.
	- Create 1-3 exercises that:
  - Tests the understanding of the lesson's content and key concepts.
  - Is interactive and engaging for learners.
  - The exercise should include:
    - Title: A concise and descriptive title for the exercise.
    - Description: A brief description of what the exercise is about and what it aims to test. Formatted using Markdown for clarity.
    - Type: The type of exercise. Must be one of: "multiple_choice", "fill_in_the_blank", "code_completion", "math", "free_text", "drag_and_drop", "matching".
    - Difficulty: The difficulty level of the exercise. Must be one of: "easy", "medium", "hard".
    - Question: The main question or task of the exercise. This should be clear and specific.
    - Options: An array of options for multiple-choice exercises (optional). Each option should have:
      - id: A unique identifier for the option.
      - text: The text of the option.
      - isCorrect: A boolean indicating if this option is the correct answer (optional, only for multiple-choice).
    - Correct Answer: The correct answer to the exercise. This should be a string that matches the expected input.
    - Explanation: A detailed explanation of the correct answer and why it is correct. This should help learners understand the concept better.
    - Validation Regex: A regular expression to validate the answer (optional, only for fill-in-the-blank or code completion).
    - Code Template: A code template for code completion exercises (optional). Should return the language of the code.
    - Hints: An array of hints to help learners if they get stuck (optional). Array of strings. Up to 3 hints. 
    - Metadata: Any additional metadata or information about the exercise (optional).
  - Ensure that the exercise is self-contained and fully explains the task, expected input, and output.

	STRICT REQUIREMENTS:
	- For multiple_choice exercises: MUST include 5 options with exactly ONE marked as correct
	- For fill_in_blank exercises: MUST include validationRegex
	- For code_completion exercises: MUST include codeTemplate with language and template
	- All exercises MUST have title, question, correctAnswer, and explanation

	EXERCISE TYPE SELECTION GUIDELINES:
	- Use "multiple_choice" for concept understanding and definitions (25% of exercises)
	- Use "fill_in_blank" for vocabulary, syntax, or completing statements (25% of exercises)
	- Use "code_completion" for programming lessons or technical implementations (20% of exercises)
	- Use "free_text" for explanations, reasoning, or open-ended questions (15% of exercises)
	- Use "math" for calculations, formulas, or numerical problems (10% of exercises)
	- Use "drag_drop" for connecting related concepts or terms (5% of exercises)

	CHOOSE EXERCISE TYPE BASED ON LESSON CONTENT:
	- If lesson contains code examples → use "code_completion" or "fill_in_blank"
	- If lesson explains concepts/theory → use "multiple_choice" or "free_text"
	- If lesson has definitions/vocabulary → use "fill_in_blank" or "drag_drop"
	- If lesson has calculations/numbers → use "math"
	- If lesson requires explanation → use "free_text"

	The target language is ${language}. All generated content must be in this language.

	INPUT:
	${JSON.stringify(lesson, null, 2)}  

	OUTPUT: 
	EXAMPLE FOR multiple_choice:
	{
  	"title": "Understanding Concepts",
  	"type": "multiple_choice",
  	"question": "What is the main purpose of...?",
  	"options": [
    	{"id": "a", "text": "Option A", "isCorrect": false},
    	{"id": "b", "text": "Correct answer", "isCorrect": true},
    	{"id": "c", "text": "Option C", "isCorrect": false},
    	{"id": "d", "text": "Option D", "isCorrect": false},
    	{"id": "e", "text": "Option E", "isCorrect": false}
  	],
  	"correctAnswer": "Correct answer",
  	"explanation": "Detailed explanation..."
	}

	EXAMPLE FOR fill_in_blank:
	{
  	"title": "Complete the Code",
  	"type": "fill_in_blank", 
  	"question": "Complete: const result = array._____(item => item > 5);",
  	"correctAnswer": "filter",
  	"explanation": "The filter method creates a new array with elements that pass the test",
  	"validationRegex": "^filter$"
	}

	EXAMPLE FOR code_completion:
	{
  	"title": "Complete the Function",
  	"type": "code_completion",
  	"question": "Complete this function to calculate the area of a circle",
  	"codeTemplate": {
    	"language": "javascript",
    	"template": "function circleArea(radius) {\\n  return Math.PI * ___;\\n}"
  	},
  	"correctAnswer": "radius * radius",
  	"explanation": "Area = π × radius²",
  	"validationRegex": "radius\\\\s*\\\\*\\\\s*radius|radius\\\\s*\\\\*\\\\*\\\\s*2|Math\\\\.pow\\\\(radius,\\\\s*2\\\\)"
	}

	EXAMPLE FOR free_text:
	{
	  "title": "Explain the Concept",
	  "type": "free_text",
	  "question": "Explain why this approach is beneficial.",
	  "correctAnswer": "efficiency and performance",
	  "explanation": "This approach improves efficiency and performance because...",
	  "validationRegex": ".*(efficiency|performance|speed|fast).*"
	}

	EXAMPLE FOR math:
	{
  	"title": "Calculate the Result",
  	"type": "math",
  	"question": "If x = 5 and y = 3, what is x² + y²?",
  	"correctAnswer": "34",
  	"explanation": "5² + 3² = 25 + 9 = 34",
  	"validationRegex": "^34$"
	}

	EXAMPLE FOR matching:
	{
  	"title": "Match the Terms",
  	"type": "matching",
  	"question": "Match each term with its definition",
  	"options": [
    	{"id": "term1", "text": "Variable", "isCorrect": false},
    	{"id": "def1", "text": "Stores data values", "isCorrect": true},
    	{"id": "term2", "text": "Function", "isCorrect": false},
    	{"id": "def2", "text": "Reusable code block", "isCorrect": true}
  	],
  	"correctAnswer": "Variable-Stores data values, Function-Reusable code block",
  	"explanation": "These are fundamental programming concepts..."
	}

	OUTPUT FORMAT (follow EXACTLY):
	{
  	"exercises": [
      {
        "title": "Exercise Title",
        "description": "Brief description",
        "type": "exercise_type_here",
        "difficulty": "medium",
        "question": "Question text",
        "correctAnswer": "answer",
        "explanation": "explanation"
      }	
    ]
  }

	CRITICAL RULES:
	- Skip lessons with insufficient content (less than 100 words)
	- DO NOT create exercises for lessons that do not need them. If a lesson is too short or does not cover enough content, skip it.
	- Every multiple_choice MUST have exactly 5 options
	- Every exercise MUST have all required fields for its type
	- Make questions specific and testable
	- Ensure correctAnswer matches what students should input
	- Validation regex should be precise but allow minor variations
	- Use the exact lesson ID from input
`;

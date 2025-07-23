import type { Lesson } from '@aristocrat/database/schema';

export const GENERATE_EXERCISES_PROMPT = (lesson: Lesson, language: string) => `
	You are an expert educator and exercise creator.
	Your task is to generate interactive exercises for the provided lesson.
	You will receive a lesson with a title, description, content, and key concepts.
	For the lesson, you will create exercises that reinforce the learning objectives and concepts covered in the lesson.

	INSTRUCTIONS:
	- For the lesson, analyze the title, description, content, and key concepts provided.
	- Create 1-3 exercises that:
  - Tests the understanding of the lesson's content and key concepts.
  - Is interactive and engaging for learners.
  - The exercise should include:
    - Title: A concise and descriptive title for the exercise.
    - Description: A brief description of what the exercise is about and what it aims to test. Formatted using Markdown for clarity.
    - Type: The type of exercise. Must be one of: "multiple_choice", "true_false", "fill_blank", "code", "drag_and_drop".
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
	- For true_false exercises: MUST include exactly ONE correct answer
	- For fill_blank exercises: MUST include validationRegex
	- For code exercises: MUST include codeTemplate with language and template
	- All exercises MUST have title, question, correctAnswer, and explanation

	EXERCISE TYPE SELECTION GUIDELINES:
	- Use "multiple_choice" for concept understanding and definitions (25% of exercises)
	- Use "true_false" for boolean questions (25% of exercises)
	- Use "fill_blank" for vocabulary, syntax, or completing statements (25% of exercises)
	- Use "code" for programming lessons or technical implementations (20% of exercises)
	- Use "drag_drop" for connecting related concepts or terms (5% of exercises)

	CHOOSE EXERCISE TYPE BASED ON LESSON CONTENT:
	- If lesson contains code examples → use "code" or "fill_blank"
	- If lesson explains concepts/theory → use "multiple_choice" or "free_text"
	- If lesson has definitions/vocabulary → use "fill_blank" or "drag_drop"
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

	EXAMPLE FOR true_false:

	{
  	"title": "True or False",
  	"type": "true_false",
  	"question": "The capital of France is Paris.",
  	"correctAnswer": "true",
  	"explanation": "Paris is the capital of France."
	}

	EXAMPLE FOR fill_blank:
	{
  	"title": "Complete the missing word",
  	"type": "fill_blank", 
  	"question": "Complete: const result = array._____(item => item > 5);",
  	"correctAnswer": "filter",
  	"explanation": "The filter method creates a new array with elements that pass the test",
  	"validationRegex": "^filter$"
	}

	EXAMPLE FOR code:
	{
  	"title": "Complete the Function",
  	"type": "code",
  	"question": "Complete this function to calculate the area of a circle",
  	"codeTemplate": {
    	"language": "javascript",
    	"template": "function circleArea(radius) {\\n  return Math.PI * ___;\\n}"
  	}, // MUST be present for code exercises
  	"correctAnswer": "radius * radius",
  	"explanation": "Area = π × radius²",
  	"validationRegex": "radius\\\\s*\\\\*\\\\s*radius|radius\\\\s*\\\\*\\\\*\\\\s*2|Math\\\\.pow\\\\(radius,\\\\s*2\\\\)"
	}

	EXAMPLE FOR drag_drop:
	{
  	"title": "Match the Terms",
  	"type": "drag_drop",
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
        "question": "Question text",
        // Include type-specific fields as shown in examples above
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
	- All the generated content must be in the target language (${language}).
`;

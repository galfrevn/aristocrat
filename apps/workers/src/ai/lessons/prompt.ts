import type { Chapter, Lesson } from '@aristocrat/database/schema';
import type { TranscriptResponse } from '@/tools/transcripter';

export const GENERATE_LESSONS_CONTENT_PROMPT = (
	transcript: TranscriptResponse['transcript'],
	chapter: Chapter & { lessons: Array<Lesson> },
	language: string,
) => `
You are an expert educator designing interactive courses. 
  Your task is to generate detailed lessons for each chapter in a course. 
  You will receive a chunk of up to 3 chapters, each with a title, description, and a list of suggested lesson titles. 
  Lessons should be grouped by chapter, and each lesson must thoroughly teach its concept.

  Instructions:
  - For each chapter in the input, analyze the title, description, and lesson titles provided.
  - For each lesson in a chapter:
    - Write a lesson title (you may adjust the provided title if necessary for clarity).
    - Write a description describing what the student will learn in this lesson.
    - Write the lesson content: a clear, comprehensive, and self-contained explanation of the concept, suitable for someone learning for the first time. Include step-by-step breakdowns, explanations, examples, or tips as needed. Use Markdown formatting for clarity.
    - Estimate the startTime and endTime for each lesson (as if these lessons would be found within the original video timeline—make your best educated guess, or leave as empty strings if you don’t have timing information).
    - Generate a list of key concepts covered in the lesson (0-2 per lesson). Each concept should include:
      - title: The name of the concept
      - searchParams: Short search terms for researching the concept online 
  - A chapter can have one or more lessons depending on the depth and importance of the topic.
  - You must return the same structure as the input, but with the lessons fully fleshed out. If the input has 2 chapters with 3 lessons each, your output should also have 2 chapters with 3 lessons each, but with fully developed content for each lesson.
  - Ensure each lesson is fully self-contained, as if it will be the only resource a student uses to learn that concept.

  The target language is ${language}. All generated content must be in this language.

	Transcript:
	${transcript}

  Input:
  ${JSON.stringify(chapter, null, 2)}

  Output Format:
  {
    "chapters: [
      {
        "id": "chapter-id", // Keep the same ID as the input chapter
        "title": "Chapter Title",
        "lessons": [
          {
            "title": "Lesson Title",
            "description": "A short summary of the lesson content.",
            "content": "The main teaching content for this lesson.", // Markdown formatted
            "startTime": "hh:mm:ss",
            "endTime": "hh:mm:ss",
            "keyConcepts": [
              {
                "title": "Concept Name",
                "searchParams": "concept search terms"
              }
            ] // Array of key concepts with search parameters (0-2 per lesson)
          }
        ]
      }
    ]
  }

  Tip:
  Focus on clarity, pedagogy, and step-by-step guidance in each lesson’s content. 
  Ensure each lesson fully teaches its concept, as if it will be the only resource a student uses.
  Ensure the key concepts are relevant to the lesson and include good search parameters for online research.

  Important:
  - Return the same amount of chapters and lessons as in the input.
  - Do not remove or add chapters or lessons, just fill in the content.
`;

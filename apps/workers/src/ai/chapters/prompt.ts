import type { UsefulTranscriptInformation } from '@/ai/types';

export const GENERATE_CHAPTERS_FROM_TRANSCRIPT_PROMPT = (
	t: UsefulTranscriptInformation,
) => `
  You are an expert course creator. 
  Your job is to analyze the following video transcript and generate a list of chapters that best organize the content into logical sections. 
  The transcript is structured as an array of text segments, each with a start time, end time, and text.

  Instructions:
  - Analyze the full transcript and identify the main topics or subjects covered in the video.
  - Group the transcript into chapters, where each chapter covers a cohesive subject or section of the video.
  - Do NOT create too many chapters. Prefer fewer, broader chapters over many small ones. Typically, a 1+ hour video should have around 2–6 chapters, but use your judgment based on the content.
  - Follow this table for amount of chapters:
  
    -------------------------------------
    | Video Length | Number of Chapters |
    |--------------|--------------------|
    | 0–10 minutes | 1–2 chapters       |
    | 10–60 minutes| 2–3 chapters       |
    | 60+ minutes  | 3–4 chapters       |
    | Over 2 hours | 4-6 chapters       |
    -------------------------------------

  - For each chapter, provide:
    - Title: A concise and descriptive chapter title.
    - Summary: A short paragraph summarizing the main ideas, key points, or skills covered in the chapter.
    - Lessons: A list of lesson titles and times that are covered in this chapter. Each lesson should be a specific topic or skill that is taught within the chapter. Chapters can have one or more lessons. Prefer fewer, broader lessons over many small ones. Tipically, a chapter should have around 1–3 lessons, but use your judgment based on the content.
      - Lesson Title: A concise and descriptive title for the lesson.
      - Lesson Start Time: The start time of the lesson in the transcript.
      - Lesson End Time: The end time of the lesson in the transcript.

  Important:
  - Use the offset and duration fields in the transcript data to determine the exact start and end times for each lesson. 
  - Convert all times to hh:mm:ss format. 
  - Ensure that the times accurately reflect where each lesson begins and ends in the transcript.
  - Ensure that the amount of generated lessons is between 1 and 3 per chapter, depending on the depth of the topic. Don't create more than 3 lessons per chapter, as this can lead to fragmentation of the content.

  Transcript:
  ${JSON.stringify(t, null, 2)}

  Output Format: 
  {
    "chapters": [
      {
        "title": "string",
        "summary": "string",
        "startTime": "string",
        "endTime": "string",
        "lessons": [
          {        
            "title": "string"
            "startTime": "string"
            "endTime": "string"
          }
        ]
      }
    ]
  }
`;

# Aristocrat Workers

This is the background job processing application for the Aristocrat monorepo, built with [Trigger.dev](https://trigger.dev) for long-running course generation workflows.

## Overview

The workers app orchestrates complex course generation workflows from YouTube videos, including:

- **Transcript Extraction**: Calls the transcripter service to extract video transcripts
- **AI Validation**: Fast validation to ensure content is suitable for course generation (< 3 seconds)
- **Parallel Generation**: Concurrent generation of course structure, chapters, and lessons
- **Assessment Creation**: Comprehensive final assessments with varied exercise types
- **Database Storage**: Persistent storage of generated content using shared database repositories
- **Progress Tracking**: Real-time progress updates with error handling and recovery

## Architecture

### Workflow Steps

1. **Main Orchestration Task** (`generate-course-from-video`)
   - Receives user ID, auth token, and video ID
   - Orchestrates the entire workflow with progress tracking
   - Handles errors and provides detailed logging

2. **Transcript Extraction** (`extract-transcript`)
   - Calls the transcripter service API
   - Returns structured transcript with timing information
   - Handles authentication and error cases

3. **Fast AI Validation** (`validate-transcript-for-course`)
   - Quick AI analysis (< 3 seconds) to validate content suitability
   - Prevents unnecessary processing of non-educational content
   - Returns confidence score and reasoning

4. **Course Structure Generation** (`generate-course-structure`)
   - AI-powered generation of course outline
   - Creates chapters, lessons, and exercise blueprints
   - Maps content to video timestamps

5. **Parallel Content Generation** (`generate-course-content-parallel`)
   - Concurrent generation of detailed lesson content
   - Creates markdown content for each lesson
   - Generates exercises with varied types and difficulties

6. **Final Assessment** (`generate-final-assessment`)
   - Comprehensive assessment covering all course material
   - Multiple exercise types (multiple choice, true/false, fill-in-blank, short answer)
   - Configurable passing scores and time limits

7. **Database Storage** (`store-course-in-database`)
   - Persists complete course structure to PostgreSQL
   - Uses shared database repositories from `@aristocrat/database`
   - Maintains referential integrity

### Key Features

- **High Performance**: Parallel processing for faster generation
- **Progress Tracking**: Real-time updates using Trigger.dev metadata
- **Error Handling**: Comprehensive error recovery and logging
- **Type Safety**: Full TypeScript integration with Zod validation
- **Pause/Resume**: Built-in workflow state management
- **Scalability**: Configurable concurrency and resource allocation

## Getting Started

### Prerequisites

- Bun runtime
- PostgreSQL database
- Trigger.dev account
- OpenAI API key
- Running transcripter service

### Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Configure your environment
# Edit .env with your actual values
```

### Environment Variables

```bash
# Trigger.dev Configuration
TRIGGER_PROJECT_ID=your_trigger_project_id    # From Trigger.dev dashboard
TRIGGER_SECRET_KEY=your_trigger_secret_key    # From Trigger.dev dashboard

# Database Configuration
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres

# AI Configuration
OPENAI_API_KEY=your_openai_api_key           # OpenAI API key for course generation

# External Services
TRANSCRIPTER_URL=http://localhost:3002        # Transcripter service URL
```

### Development

```bash
# Start development server
bun run dev

# Type checking
bun run check-types

# Build for production
bun run build
```

### Deployment

```bash
# Deploy to Trigger.dev
bun run deploy
```

## Usage

### Triggering Course Generation

From your backend application:

```typescript
import { tasks } from '@trigger.dev/sdk/v3';
import type { generateCourseFromVideoTask } from '@aristocrat/workers';

// Trigger course generation
const handle = await tasks.trigger<typeof generateCourseFromVideoTask>(
  'generate-course-from-video',
  {
    userId: 'user_123',
    userAuthToken: 'jwt_token',
    videoId: 'youtube_video_id',
    language: 'es',
    generationProcessId: crypto.randomUUID(),
    difficulty: 'medium',
    targetLanguage: 'es',
  }
);

// Monitor progress
console.log('Course generation started:', handle.id);
```

### Monitoring Progress

```typescript
import { runs } from '@trigger.dev/sdk/v3';

// Subscribe to run updates
for await (const run of runs.subscribeToRun(handle.id)) {
  const progress = run.metadata?.progress;
  if (progress) {
    console.log(`Progress: ${progress.progressPercentage}%`);
    console.log(`Current step: ${progress.currentStep}`);
  }
}
```

## API Reference

### Main Task: `generate-course-from-video`

**Input:**
```typescript
interface CourseGenerationWorkflowPayload {
  userId: string;              // User ID for ownership
  userAuthToken: string;       // JWT token for transcripter auth
  videoId: string;            // YouTube video ID
  language?: string;          // Video language (default: 'es')
  generationProcessId: string; // Unique process identifier
  difficulty?: 'easy' | 'medium' | 'hard'; // Target difficulty
  targetLanguage?: string;    // Course language (default: 'es')
}
```

**Output:**
```typescript
interface CourseGenerationResult {
  success: boolean;
  courseId: string;
  generationProcessId: string;
  message: string;
}
```

### Progress Tracking

The workflow provides real-time progress updates through metadata:

```typescript
interface WorkflowProgress {
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  progressPercentage: number;
  estimatedTimeRemaining?: number;
  errors?: WorkflowError[];
}
```

### Error Handling

Comprehensive error handling with detailed logging:

- **Transcript Extraction Failures**: Invalid video ID, network issues, authentication failures
- **AI Validation Failures**: Model unavailability, rate limiting, invalid responses
- **Generation Failures**: Content generation errors, timeout issues, resource constraints
- **Database Failures**: Connection issues, constraint violations, transaction failures

## Performance Optimization

### Parallel Processing

The workflow leverages parallel processing for:
- Multiple lesson content generation
- Exercise creation across chapters
- Database insertions for related entities

### Resource Management

- Configurable task timeouts
- Memory-efficient streaming for large transcripts
- Optimized AI prompt sizes
- Connection pooling for database operations

### Scalability

- Horizontal scaling with Trigger.dev
- Queue management for high-volume processing
- Rate limiting for external API calls
- Graceful degradation under load

## Testing

```bash
# Run tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run specific test file
bun test src/services/ai-generation.test.ts
```

## Contributing

1. Follow the project's TypeScript and functional programming conventions
2. Use descriptive variable names and comprehensive JSDoc comments
3. Implement comprehensive error handling
4. Add unit tests for new functionality
5. Update documentation for API changes

## Troubleshooting

### Common Issues

**Task timeout errors:**
- Increase `maxDuration` in task configuration
- Optimize AI prompts for faster responses
- Check external service availability

**Database connection issues:**
- Verify `DATABASE_URL` environment variable
- Ensure PostgreSQL is running and accessible
- Check connection pool limits

**AI generation failures:**
- Verify `OPENAI_API_KEY` is valid
- Check rate limits and quotas
- Monitor model availability

**Transcripter service errors:**
- Ensure transcripter service is running
- Verify `TRANSCRIPTER_URL` configuration
- Check authentication token validity

### Debugging

Enable debug logging by setting `logLevel: 'debug'` in `trigger.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  logLevel: 'debug',
});
```

## Related Documentation

- [Trigger.dev Documentation](https://trigger.dev/docs)
- [Aristocrat Database Package](../packages/database/README.md)
- [Aristocrat AI Package](../packages/ai/README.md)
- [Transcripter Service](../transcripter/README.md) 
# @aristocrat/ai

Production-grade AI utilities and providers for Aristocrat using Vercel AI SDK.

## Features

- 🚀 **Multiple AI Providers**: OpenAI, Anthropic, Perplexity
- 🔄 **Streaming Support**: Real-time text generation with callbacks
- 📦 **Object Generation**: Structured data generation with Zod schemas
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- ⚙️ **Configurable**: Flexible configuration system with sensible defaults
- 🎯 **Type Safe**: Full TypeScript support with strict typing

## Installation

```bash
bun add @aristocrat/ai
```

## Usage

### Basic Setup

```typescript
import { AristocratsAI } from '@aristocrat/ai'

const aiClient = new AristocratsAI({
	provider: 'openai',
	modelName: 'gpt-4.1',
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
	maxTokens: 4096
})
```

### Text Generation

```typescript
const textResponse = await aiClient.generateText({
	messages: [
		{ role: 'user', content: 'Hello, how are you?' }
	]
})

console.log(textResponse.text)
```

### Streaming Text

```typescript
const textStream = await aiClient.streamText({
	messages: [
		{ role: 'user', content: 'Tell me a story' }
	],
	onChunk: (chunkContent) => {
		process.stdout.write(chunkContent)
	},
	onFinish: (completionResult) => {
		console.log('\\nGeneration complete:', completionResult)
	}
})
```

### Object Generation

```typescript
import { z } from 'zod'

const developerSchema = z.object({
	name: z.string(),
	age: z.number(),
	skills: z.array(z.string())
})

const objectResponse = await aiClient.generateObject({
	messages: [
		{ role: 'user', content: 'Generate a developer profile' }
	],
	schema: developerSchema,
	schemaName: 'DeveloperProfile'
})

console.log(objectResponse.object) // Fully typed!
```

### Provider Switching

```typescript
// Switch to Anthropic
const claudeClient = aiClient.withConfiguration({
	provider: 'anthropic',
	modelName: 'claude-4-sonnet-20250514',
	apiKey: process.env.ANTHROPIC_API_KEY
})

const claudeResponse = await claudeClient.generateText({
	messages: [{ role: 'user', content: 'Hello Claude!' }]
})
```

## Configuration

### Available Providers

- **OpenAI**: `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`, `gpt-4o`, `gpt-4o-mini`, `o1`, `o1-mini`, `o3-mini`, `o3`, `o4-mini`, `chatgpt-4o-latest`
- **Anthropic**: `claude-4-opus-20250514`, `claude-4-sonnet-20250514`, `claude-3-7-sonnet-20250219`, `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`
- **Perplexity**: `sonar-deep-research`, `sonar-reasoning-pro`, `sonar-reasoning`, `sonar-pro`, `sonar`

### Configuration Options

```typescript
interface AIConfiguration {
	provider: 'openai' | 'anthropic' | 'perplexity'
	modelName: string
	apiKey?: string
	baseURL?: string
	temperature?: number // 0-2
	maxTokens?: number
	topP?: number // 0-1
	frequencyPenalty?: number // -2 to 2
	presencePenalty?: number // -2 to 2
}
```

## Error Handling

The package includes comprehensive error handling with automatic retry logic:

```typescript
try {
	const textResponse = await aiClient.generateText({
		messages: [{ role: 'user', content: 'Hello!' }]
	})
} catch (caughtError) {
	if (caughtError.isRetryable) {
		// Rate limit or server error - can retry
		console.log('Retryable error:', caughtError.message)
	} else {
		// Authentication or other permanent error
		console.log('Permanent error:', caughtError.message)
	}
}
```

## Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Type checking
bun run check-types

# Development mode
bun run dev
```

## License

MIT
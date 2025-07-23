# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Primary Development**
- `bun run dev` - Automated development setup (preferred): Checks system requirements, manages Docker PostgreSQL container, runs migrations, starts all services
- `bun run dev:turbo` - Start development servers only (server on :3000, website on :3001)
- `bun run dev:web` - Start Next.js website only (:3001)
- `bun run dev:server` - Start Hono API server only (:3000)

**Database Operations**
- `bun run db:push` - Push schema changes to database (development)
- `bun run db:studio` - Open Drizzle Studio for database inspection
- `bun run db:generate` - Generate migration files from schema changes
- `bun run db:migrate` - Run pending migrations

**Build & Quality**
- `bun run build` - Build all applications for production
- `bun run check` - Run Biome linter and formatter
- `bun run check-types` - TypeScript type checking across all apps

**Testing**
- `bun run test` - Run Jest tests across all packages
- `bun run test:watch` - Run tests in watch mode (transcripter app)
- `bun run test:coverage` - Run tests with coverage reporting (transcripter app)

**AI/Workers**
- `bun run dev` (workers) - Start Trigger.dev development environment
- `bun run deploy` (workers) - Deploy jobs to Trigger.dev

## Quick Tips
- Do not use `biome check --write .` as it can cause unintended changes across the entire monorepo
- When creating new database schemas, always export types from the schema files
- Use route groups `(groupName)` in Next.js for organizing related pages without affecting URL structure

## Architecture Overview

**Monorepo Structure**
- `apps/server/` - Hono + tRPC API server with PostgreSQL/Drizzle ORM
- `apps/website/` - Next.js 15 frontend with App Router, tRPC client, shadcn/ui components
- `apps/transcripter/` - Transcript processing microservice with Hono, SRT/VTT parsing, JWT auth
- `apps/workers/` - AI processing jobs with Trigger.dev (assessment, chapters, concepts, exercises, lessons)
- `packages/database/` - Shared database package with Drizzle ORM, schemas, repositories, and utilities
- `packages/typescript/` - Shared TypeScript configurations across the monorepo

**Key Technologies**
- **Runtime**: Bun for package management and development
- **Build System**: Turbo for monorepo orchestration
- **Database Stack**: PostgreSQL with Drizzle ORM, automatic Docker setup
- **API Layer**: tRPC for type-safe client-server communication
- **Authentication**: Better Auth with session management
- **Frontend**: Next.js 15 + React 19, Tailwind CSS v4, shadcn/ui components, Radix UI primitives
- **AI Processing**: Multiple providers (OpenAI, Google AI, Perplexity) via Vercel AI SDK
- **Background Jobs**: Trigger.dev v3 for AI content generation pipeline
- **Code Quality**: Biome for linting/formatting (tab indentation, single quotes)
- **State Management**: TanStack Query for server state, Zustand patterns for client state

**Development Environment**
- The project uses a custom development script (`scripts/dev.ts`) that automatically:
  - Validates system requirements (Docker, Bun)
  - Creates/starts PostgreSQL container (`aristocrat-development-database`)
  - Waits for database readiness
  - Runs schema migrations via `db:push`
  - Starts all development servers

**Database Setup**
- PostgreSQL runs in Docker container with persistent volume (`aristocrat_postgres_data`)
- Connection: `postgres://postgres:mypassword@localhost:5432/postgres`
- Schema files in `packages/database/src/schema/` (shared package)
- Database package exports: schema, repository functions, and utilities  
- Migrations auto-generated with Drizzle Kit in database package
- Multi-export system: main index, separate schema/repository/utils exports

**Database Schema Architecture**
- **Authentication**: Better Auth integration (users, sessions, accounts, verification)
- **Content**: courses, chapters, lessons with hierarchical relationships
- **Learning**: assessments, exercises with response tracking
- **Progress**: course, chapter, lesson progress with user associations
- **System**: banners, notes for administrative features
- All schemas include proper TypeScript types and Zod validation
- Repository pattern with dedicated functions for each entity type

**File Upload**
- Uses UploadThing for file management
- API endpoints in `apps/website/src/app/api/uploadthing/`

**Authentication Flow**
- Better Auth handles registration/login with HTTP-only cookies
- tRPC middleware validates sessions for protected routes
- Auth routes: `/auth/login`, `/auth/register`

**Code Conventions**
- Biome enforces tab indentation, single quotes, organized imports
- TypeScript strict mode enabled across all apps
- Component organization: UI components in `components/ui/`, business logic in feature directories
- tRPC routers in `apps/server/src/routers/`, client hooks via `@trpc/tanstack-react-query`

**Linting Rules**
- Custom Biome configuration with Tailwind class sorting via `useSortedClasses`
- Error-level enforcement for style consistency
- Nursery rule `useUniqueElementIds` disabled for React components

**Environment Variables**
- Server: `.env` file in `apps/server/` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CORS_ORIGIN`, `BETTER_AUTH_URL`
- Website: Next.js environment variables for `NEXT_PUBLIC_SERVER_URL`, `UPLOADTHING_TOKEN`
- Database: `.env` file in `packages/database/` with `DATABASE_URL` (auto-created by dev script)
- Transcripter: Uses JWT tokens for authentication, no specific env file required

**AI Processing Pipeline**
- AI workers handle course generation pipeline: validation → chapters → concepts → lessons → exercises → assessments
- Each AI module has dedicated prompts and processing logic in `apps/workers/src/ai/`
- Trigger.dev orchestrates long-running AI generation tasks with proper error handling
- Supports multiple AI providers with fallback mechanisms
- Transcript processing via dedicated transcripter microservice

**Frontend Architecture Patterns**
- Route groups `(dashboard)` organize dashboard pages without affecting URLs
- Resizable UI components with localStorage persistence (`@/components/resizable/`)
- Context providers for course content and progress state
- Custom hooks for debouncing, mobile detection, and overflow detection
- shadcn/ui component system with consistent design tokens

**Package Management**
- Uses Bun workspaces with shared TypeScript configuration (`@aristocrat/typescript`)
- Database package (`@aristocrat/database`) provides shared schema and utilities
- Each app can import from workspace packages using `workspace:*` protocol
- Component library imports via path aliases (`@/components`, `@/lib`, `@/hooks`)

**Testing Architecture**
- Jest configuration in root and individual packages
- Transcripter app has comprehensive test coverage for error handling, services, and utilities
- Database package includes repository and utility tests
- Mock configurations for testing database operations and external services

**Git Workflow & Conventions**
- Conventional commits enforced via commitlint with custom configuration
- Pre-commit hooks run Biome formatting automatically
- Husky handles git hooks with lint-staged for file-specific operations
- Commit types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

**Development Patterns & Best Practices**
- **Component Organization**: UI components in `components/ui/`, business logic in feature directories
- **Type Safety**: Export types from schema files, use tRPC for API type safety
- **Error Handling**: Global error boundaries, toast notifications via sonner
- **Performance**: TanStack Query for caching, resizable components for UX
- **Accessibility**: Radix UI primitives ensure ARIA compliance
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

**Troubleshooting Common Issues**
- **Database Connection**: Ensure Docker container is running, check `scripts/dev.ts` for connection logic
- **Port Conflicts**: Use `bun run kill:ports` to free up development ports
- **Build Issues**: Run `bun run check-types` to identify TypeScript errors
- **Dependency Issues**: Delete node_modules and run `bun install` to refresh dependencies
- **Migrations**: Use `db:push` for development, `db:generate` + `db:migrate` for production
- **Workers/AI**: Check Trigger.dev dashboard for job status and logs
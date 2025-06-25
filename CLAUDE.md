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

## Architecture Overview

**Monorepo Structure**
- `apps/server/` - Hono + tRPC API server with PostgreSQL/Drizzle ORM
- `apps/website/` - Next.js 15 frontend with App Router, tRPC client
- `apps/workers/` - Background job processing (Trigger.dev integration planned)

**Key Technologies**
- **Runtime**: Bun for package management and development
- **Build System**: Turbo for monorepo orchestration
- **Database Stack**: PostgreSQL with Drizzle ORM, automatic Docker setup
- **API Layer**: tRPC for type-safe client-server communication
- **Authentication**: Better Auth with session management
- **Frontend**: Next.js 15 + React 19, Tailwind CSS, Radix UI components
- **Code Quality**: Biome for linting/formatting (tab indentation, single quotes)

**Development Environment**
- The project uses a custom development script (`scripts/dev.ts`) that automatically:
  - Validates system requirements (Docker, Bun)
  - Creates/starts PostgreSQL container (`aristocrat-development-database`)
  - Waits for database readiness
  - Runs schema migrations via `db:push`
  - Starts all development servers

**Database Setup**
- PostgreSQL runs in Docker container with persistent volume
- Connection: `postgres://postgres:mypassword@localhost:5432/postgres`
- Schema files in `apps/server/src/db/schema/`
- Migrations auto-generated with Drizzle Kit

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
- Server: `.env` file in `apps/server/` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CORS_ORIGIN`
- Website: Next.js environment variables for `NEXT_PUBLIC_SERVER_URL`, `UPLOADTHING_TOKEN`
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/logo.avif">
    <source media="(prefers-color-scheme: light)" srcset="./docs/logo.avif">
    <img src="./docs/logo.avif" alt="Aristocrat Logo" width="120" height="120" style="background-color: #000; padding: 20px; border-radius: 12px;">
  </picture>

  <h1 align="center">Aristocrat</h1>

  <p align="center">
    <strong>AI-Powered Course Generation Platform</strong>
    <br />
    Transform videos into comprehensive learning experiences using advanced AI
    <br />
    <br />
    <a href="#getting-started"><strong>Get Started »</strong></a>
    <br />
    <br />
    <a href="#features">Features</a>
    ·
    <a href="#tech-stack">Tech Stack</a>
    ·
    <a href="#api-documentation">API Docs</a>
    ·
    <a href="#contributing">Contributing</a>
  </p>
</div>

## About Aristocrat

Aristocrat is a cutting-edge educational platform that leverages artificial intelligence to automatically generate comprehensive courses from video content. Our platform transforms raw video materials into structured, interactive learning experiences with AI-powered chat assistance, progress tracking, and personalized learning paths.

### 🎯 Key Features

- **🤖 AI Course Generation**: Automatically create structured courses from video content using advanced AI models
- **💬 Interactive Chat**: Built-in AI assistant "Bart" for real-time learning support and Q&A
- **📊 Progress Tracking**: Comprehensive learning analytics and progress monitoring
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🔐 Secure Authentication**: Enterprise-grade authentication with Better Auth
- **📱 Cross-Platform**: Responsive design that works seamlessly across all devices
- **⚡ Real-time Updates**: Live course updates and collaborative features
- **📁 File Management**: Integrated file upload and management system

## Tech Stack

Aristocrat is built using modern, scalable technologies:

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Motion](https://motion.dev/)** - Smooth animations and transitions
- **[Sonner](https://sonner.emilkowal.ski/)** - Beautiful toast notifications

### Backend
- **[Hono](https://hono.dev/)** - Lightweight, fast web framework
- **[tRPC](https://trpc.io/)** - End-to-end typesafe APIs
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication solution
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM with PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database

### Development & Deployment
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager
- **[Turbo](https://turbo.build/)** - High-performance build system
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[Docker](https://www.docker.com/)** - Containerized deployment
- **[Trigger.dev](https://trigger.dev/)** - Background job processing (planned)

### Additional Tools
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization
- **[UploadThing](https://uploadthing.com/)** - File upload management
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for code quality

## Project Structure

```
aristocrat/
├── apps/
│   ├── server/          # Hono + tRPC API server
│   │   ├── src/
│   │   │   ├── db/      # Database schema and migrations
│   │   │   ├── lib/     # Auth, context, and utilities
│   │   │   └── routers/ # tRPC route definitions
│   │   └── drizzle.config.ts
│   ├── website/         # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/     # App Router pages and layouts
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── hooks/   # Custom React hooks
│   │   │   └── lib/     # Client utilities and auth
│   │   └── next.config.ts
│   └── workers/         # Background job processing
├── docs/                # Documentation and assets
├── scripts/             # Development automation scripts
└── package.json         # Workspace configuration
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **[Bun](https://bun.sh/)** (v1.2.15 or later)
- **[Docker](https://www.docker.com/)** (for database)
- **[Git](https://git-scm.com/)**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/galfrevn/aristocrat.git
   cd aristocrat
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp apps/server/.env.example apps/server/.env
   
   # Edit the environment file with your configuration
   # Required variables:
   # - DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres
   # - CORS_ORIGIN=http://localhost:3001
   # - BETTER_AUTH_SECRET=your-secret-here
   # - BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Start the development environment**
   ```bash
   bun run dev
   ```

   This command will:
   - ✅ Check system requirements (Docker, Bun)
   - 🐳 Create and start PostgreSQL container if needed
   - ⏳ Wait for database to be ready
   - 🗄️ Run database migrations
   - 🚀 Start all development servers

5. **Access the application**
   - **Website**: [http://localhost:3001](http://localhost:3001)
   - **API Server**: [http://localhost:3000](http://localhost:3000)
   - **Database Studio**: `bun run db:studio`

## Development

### Available Scripts

```bash
# Development
bun run dev              # Start all services with automated setup
bun run dev:turbo        # Start development servers only
bun run dev:web          # Start website only
bun run dev:server       # Start API server only

# Database
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio
bun run db:generate      # Generate migration files
bun run db:migrate       # Run pending migrations

# Build & Quality
bun run build            # Build all applications
bun run check            # Run Biome linter and formatter
bun run check-types      # TypeScript type checking
```

### Development Workflow

1. **Database Changes**: Update schema in `apps/server/src/db/schema/`
2. **Push Changes**: Run `bun run db:push` to sync with database
3. **API Routes**: Add tRPC routes in `apps/server/src/routers/`
4. **Frontend**: Use tRPC client hooks in React components
5. **Testing**: Create test files alongside source code
6. **Formatting**: Pre-commit hooks automatically format code

### Environment Configuration

#### Server (.env)
```env
# Database
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres

# CORS
CORS_ORIGIN=http://localhost:3001

# Authentication
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Optional
NODE_ENV=development
```

#### Website (Environment Variables)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
UPLOADTHING_TOKEN=your-uploadthing-token
```

## API Documentation

### Authentication Endpoints

```bash
POST /api/auth/sign-up     # User registration
POST /api/auth/sign-in     # User login
POST /api/auth/sign-out    # User logout
GET  /api/auth/session     # Get current session
```

### tRPC Routes

The API uses tRPC for type-safe client-server communication:

```typescript
// Example client usage
import { trpc } from '@/utils/trpc'

// Get user profile
const { data: user } = trpc.user.profile.useQuery()

// Update course progress
const updateProgress = trpc.course.updateProgress.useMutation()
```

## Architecture

### Monorepo Structure

Aristocrat uses a monorepo architecture with multiple applications:

- **apps/server**: Hono-based API server with tRPC
- **apps/website**: Next.js frontend application  
- **apps/workers**: Background job processing (Trigger.dev)

### Database Schema

```sql
-- Core tables
users                    # User accounts and profiles
sessions                 # Authentication sessions
accounts                 # OAuth account linking
courses                  # Generated course content
course_progress         # User learning progress
chat_sessions           # AI chat conversations
files                   # Uploaded content and assets
```

### Authentication Flow

1. User registers/logs in via Better Auth
2. Session tokens stored securely with HTTP-only cookies
3. tRPC middleware validates sessions for protected routes
4. Frontend redirects unauthenticated users to login

## Deployment

### Production Build

```bash
# Build all applications
bun run build

# Check production readiness
bun run check-types
```

### Docker Deployment

```dockerfile
# Production Dockerfile example
FROM oven/bun:alpine

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Environment Variables

Set these in your production environment:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=production-secret-key
CORS_ORIGIN=https://yourdomain.com
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure code quality: `bun run check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Biome with consistent rules
- **Naming**: Descriptive, camelCase for variables, PascalCase for components
- **Comments**: JSDoc for functions, inline comments for complex logic

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [View Docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/galfrevn/aristocrat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/galfrevn/aristocrat/discussions)

---

<div align="center">
  <strong>Built with ❤️ by the Aristocrat Team</strong>
  <br />
  <br />
  <a href="https://github.com/galfrevn/aristocrat">⭐ Star on GitHub</a>
</div>
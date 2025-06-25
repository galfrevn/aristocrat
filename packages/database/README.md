# @aristocrat/database

This package contains all database-related code for the Aristocrat project, including:

- Database connection and configuration
- Schema definitions for all tables
- Repository classes for data access
- Database utilities and helpers

## Structure

```
src/
├── index.ts          # Main exports and database connection
├── schema/           # Drizzle schema definitions
│   ├── index.ts     # Schema exports
│   ├── auth.ts      # Authentication tables
│   └── courses.ts   # Course-related tables
├── repository/       # Data access layer
│   ├── index.ts     # Repository exports
│   └── courses.ts   # Course repository
├── utils/           # Database utilities
│   ├── index.ts     # Utility exports
│   ├── pg.ts        # PostgreSQL helpers
│   └── query.ts     # Query utilities
└── migrations/      # Database migration files
```

## Usage

### Import the database connection

```typescript
import { database } from '@aristocrat/database';
```

### Use repository classes

```typescript
import { CoursesRepository } from '@aristocrat/database';

const coursesRepo = new CoursesRepository(database);
const course = await coursesRepo.get('course-id');
```

### Import schema for type definitions

```typescript
import { courses, user } from '@aristocrat/database';
```

## Database Commands

All database operations should be run from this package:

```bash
# Generate migrations
bun run db:generate

# Push schema to database
bun run db:push

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

Or from the root of the monorepo:

```bash
# All commands are available from root
bun db:push
bun db:studio
bun db:generate
bun db:migrate
```

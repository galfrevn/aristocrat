# @aristocrat/typescript

Shared TypeScript configurations for the Aristocrat monorepo.

## Configurations

### Base Configuration (`base.json`)
- Core TypeScript settings shared across all packages
- Strict type checking enabled
- Modern ECMAScript target
- Optimized for development and production

### Node.js Configuration (`node.json`)
- Extends base configuration
- Optimized for Node.js environments
- Includes Node.js types
- Configured for server-side applications

### Next.js Configuration (`nextjs.json`)
- Extends base configuration
- Optimized for Next.js applications
- Includes DOM types and JSX support
- Configured with Next.js plugin support

## Usage

### In a Node.js package (server, database, etc.)

Create a `tsconfig.json` in your package:

```json
{
  "extends": "@aristocrat/typescript/node.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

### In a Next.js package (website)

Create a `tsconfig.json` in your package:

```json
{
  "extends": "@aristocrat/typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### For packages with custom requirements

You can extend the base configuration and add your own overrides:

```json
{
  "extends": "@aristocrat/typescript/base.json",
  "compilerOptions": {
    "target": "ES2020",
    "types": ["bun", "node"]
  }
}
```

## Features

- **Strict Type Checking**: All configurations enable strict mode for better code quality
- **Modern JavaScript**: Targets modern ECMAScript features
- **Consistent Settings**: Shared base ensures consistency across packages
- **Environment Specific**: Tailored configurations for different runtime environments
- **Development Optimized**: Includes source maps, declaration files, and fast compilation

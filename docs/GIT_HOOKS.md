# Git Hooks Documentation

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks for maintaining code quality and enforcing best practices.

## 🎯 Available Hooks

### Pre-commit Hook
**Triggered:** Before each commit
**Actions:**
- ✅ Runs `lint-staged` to format and lint staged files
- ✅ Performs TypeScript type checking
- ⚠️ Warns about TODO/FIXME comments
- ⚠️ Warns about debug statements (console.log, debugger)

### Commit Message Hook
**Triggered:** When creating a commit message
**Actions:**
- ✅ Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) format
- ✅ Provides helpful error messages with examples

### Prepare Commit Message Hook
**Triggered:** Before opening the commit message editor
**Actions:**
- 💡 Auto-suggests commit type based on branch name (e.g., `feat/user-auth` → `feat: `)

### Pre-push Hook
**Triggered:** Before pushing to remote
**Actions:**
- ✅ Runs full project build
- ✅ Runs tests (if available)
- ⚠️ Warns when pushing to main/master
- ⚠️ Checks for large files (>50MB)
- ⚠️ Scans for potential secrets

### Post-merge Hook
**Triggered:** After merging branches
**Actions:**
- 📦 Auto-installs dependencies if package.json/bun.lock changed
- 💡 Provides helpful reminders for database migrations
- 💡 Suggests restarting dev server for config changes

## 🚀 Usage

### Making Commits
```bash
# Option 1: Use the interactive commit wizard (recommended)
bun run commit

# Option 2: Standard git commit (must follow conventional format)
git commit -m "feat: add user authentication system"
```

### Conventional Commit Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Valid types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Other changes that don't modify src or test files
- `perf`: A code change that improves performance
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies
- `revert`: Reverts a previous commit

**Examples:**
```bash
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
refactor(auth): improve token validation
feat(dashboard): add user profile page
```

## 🛠️ Customization

### Disabling Hooks Temporarily
```bash
# Skip all hooks for a single commit
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

### Modifying Hook Behavior
Edit the hook files in `.husky/` directory:
- `.husky/pre-commit` - Pre-commit validations
- `.husky/commit-msg` - Commit message validation
- `.husky/pre-push` - Pre-push validations
- `.husky/post-merge` - Post-merge actions
- `.husky/prepare-commit-msg` - Commit message preparation

### Lint-staged Configuration
Modify the `lint-staged` section in `package.json` to change which files are processed and how:

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["biome check --write ."],
    "*.{json,md}": ["biome format --write"]
  }
}
```

## 🎨 Branch Naming Conventions

For automatic commit type suggestions, use these branch prefixes:
- `feat/` or `feature/` → suggests `feat:`
- `fix/`, `bugfix/`, or `hotfix/` → suggests `fix:`
- `docs/` or `doc/` → suggests `docs:`
- `refactor/` → suggests `refactor:`
- `test/` or `tests/` → suggests `test:`
- `chore/` → suggests `chore:`
- `perf/` or `performance/` → suggests `perf:`

## 🔧 Troubleshooting

### Hook Not Running
```bash
# Reinstall husky
bun run prepare
```

### Permission Issues
```bash
# Make hooks executable
chmod +x .husky/*
```

### Bypass Hooks (Emergency)
```bash
# For commits
git commit --no-verify -m "message"

# For pushes
git push --no-verify
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Commitlint](https://commitlint.js.org/)

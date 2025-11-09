# GitHub Actions CI/CD Configuration

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)
**Triggers:** Push/PR to `main` or `develop` branches

**Jobs:**
- ✅ Install dependencies (`npm ci`)
- 🔍 Lint TypeScript code (`npm run lint`)
- 🎨 Lint SCSS styles (`npm run lint:styles`)
- 📝 Check Prettier formatting (`npm run format:check`)
- 🧪 Run unit tests with coverage (`npm run test:coverage`)
- 🏗️ Build production bundle (`npm run build:prod`)
- 📦 Upload artifacts (dist folder on main branch)
- 📊 Upload coverage to Codecov (optional)

**Matrix Strategy:** Tests on Node 14.x and 16.x

### 2. PR Linter (`lint-pr.yml`)
**Triggers:** Pull request opened/updated

**Jobs:**
- 🔍 Run ESLint and annotate PR files with inline comments
- 📝 Check code formatting

## Local Testing

Before pushing, run these commands to match CI checks:

```bash
# Install dependencies
npm ci

# Run all quality checks
npm run lint:ci         # Lint TS + SCSS
npm run format:check    # Check formatting
npm test                # Run tests

# Auto-fix issues
npm run lint:fix        # Fix ESLint errors
npm run format          # Format with Prettier

# Build production
npm run build:prod
```

## Configuration Files

- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/lint-pr.yml` - PR-specific linting
- `karma.conf.js` - Test runner config (includes `ChromeHeadlessCI` for CI)
- `.eslintrc.json` - Linting rules
- `.prettierrc.json` - Code formatting rules

## CI Environment

- **OS:** Ubuntu Latest
- **Node versions:** 14.x, 16.x
- **Package manager:** npm (with cache)
- **Browser:** ChromeHeadlessCI (headless mode for tests)

## Badges (optional)

Add to README.md:

```markdown
![CI](https://github.com/AhmedSdiri77r7/Budgetna/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/AhmedSdiri77r7/Budgetna/branch/main/graph/badge.svg)](https://codecov.io/gh/AhmedSdiri77r7/Budgetna)
```

## Troubleshooting

**Tests fail in CI but pass locally:**
- Ensure you're using Node 14.14+ (check with `node -v`)
- Run `npm ci` instead of `npm install` to match exact dependencies
- Use `ChromeHeadlessCI` browser: `npm test -- --browsers=ChromeHeadlessCI`

**Lint errors in CI:**
- Run `npm run lint:fix` locally to auto-fix
- Run `npm run format` to fix formatting
- Commit and push changes

**Build fails:**
- Check `npm run build:prod` locally
- Verify `NODE_OPTIONS=--openssl-legacy-provider` is set (handled by scripts)

## Next Steps

1. Enable GitHub Actions in repository settings
2. (Optional) Setup Codecov account and add `CODECOV_TOKEN` secret
3. (Optional) Add status badges to README.md
4. Create a pull request to test the workflow

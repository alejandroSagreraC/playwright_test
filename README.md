# Playwright BDD Boilerplate

[![Quality](https://img.shields.io/github/actions/workflow/status/alejandroSagreraC/playwright_test/quality.yml?branch=main&label=quality)](https://github.com/alejandroSagreraC/playwright_test/actions/workflows/quality.yml)
![Node](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.59.1-45BA63?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![BDD](https://img.shields.io/badge/BDD-Cucumber-23A457?logo=cucumber&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-1F6FEB)

Professional starter template for end-to-end automation with Playwright, TypeScript, BDD (Gherkin), and Page Object Model architecture.

Designed as both:
- a production-ready baseline for QA automation teams,
- and a polished public showcase for GitHub portfolios.

## Highlights

- Playwright + TypeScript for reliable browser automation.
- BDD workflow with feature files and step definitions.
- POM structure for maintainable UI interaction logic.
- Environment-based execution (qa, stg, prod).
- CI quality gates with lint and npm audit.
- Built-in secret-check script for safer public repositories.

## Project Structure

```text
features/              # Gherkin .feature files
steps/                 # Step definitions and fixtures
models/                # Page Object Models
config/                # Environment and config helpers
scripts/               # Utility scripts (security checks, etc.)
docs/                  # GitHub Pages showcase
playwright.config.ts   # Playwright runtime configuration
```

## Requirements

- Node.js 20+
- npm

## Installation

```bash
npm install
npx playwright install
```

## Quick Start

1. Create an environment file from the template.
2. Configure target values for your system under test.
3. Generate BDD runtime and execute tests.

```bash
# macOS/Linux
cp .env.example .env.qa

# Windows PowerShell
Copy-Item .env.example .env.qa

npm run bddgen
npm run test:qa
```

## Environment Variables

Use placeholder values only in versioned files.

| Variable | Description |
| --- | --- |
| BASE_URL | Base URL for the target application |
| ADMIN_USER | Username for test authentication |
| ADMIN_PASS | Password from local env or CI secret manager |
| API_URL | API base URL |

Example:

```env
BASE_URL="https://your-host/"
ADMIN_USER="your-user@company.com"
ADMIN_PASS="CHANGEME_USE_LOCAL_OR_CI_SECRET"
API_URL="https://your-host"
```

## Test Execution

```bash
npm run test:qa
npm run test:stg
npm run test:prod
```

Useful scripts:

- npm run bddgen
- npm run lint
- npm run check:secrets

## Reports

- Playwright HTML report
- Trace artifacts for debugging and triage

Open the latest report:

```bash
npx playwright show-report
```

## CI Quality Gates

This repo includes a GitHub Actions workflow at `.github/workflows/quality.yml` with:
- Build
- Lint
- npm audit

## Security Best Practices

- Never commit real credentials.
- Keep `.env` files local and use CI secret stores.
- Run secret checks before push: `npm run check:secrets`.
- Keep ignore rules for local artifacts and auth state.

## GitHub Pages Showcase

The repository includes a professional landing page for public presentation:
- `docs/index.html`

## License

ISC

# Playwright BDD Boilerplate

Base template for E2E automation using Playwright, TypeScript, BDD, and the Page Object Model.

This repository is intended as a public showcase and a practical starting point for automation projects.

## Features

- Playwright + TypeScript for robust E2E testing.
- BDD with Gherkin scenarios and step definitions.
- POM to separate UI interactions from test behavior.
- Multi-environment configuration using environment variables.
- CI/CD-friendly structure and conventions.

## Project Structure

- features/: Gherkin .feature files.
- steps/: BDD step implementations and fixtures.
- models/: Page Objects.
- config/: configuration helpers.
- playwright.config.ts: Playwright runtime configuration.

## Requirements

- Node.js 20 or later.
- npm.

## Installation

```bash
npm install
npx playwright install
```

## Quick Start

1. Copy the environment template file.
2. Adjust variables for your application.
3. Run the test suite.

Example workflow:

```bash
# macOS/Linux
cp .env.example .env.qa

# Windows PowerShell
copy .env.example .env.qa

npm run bddgen
npm run test:qa
```

## Environment Variables (Example)

Use placeholder names and values that match your project.

```env
APP_BASE_URL=https://example.test
E2E_USER=test.user@example.test
E2E_PASSWORD=change_me
ENV=qa
```

## Execution

```bash
npm run bddgen
npm run test:qa
npm run test:stg
npm run test:prod
```

## Reports

- Playwright HTML report.
- Traces and execution artifacts for each run.

Open the latest report:

```bash
npx playwright show-report
```

## Security Best Practices

- Never commit real credentials to the repository.
- Use local .env files and CI secret managers.
- Keep pre-commit hooks and secret scanning enabled.

## License

Define the license for this template (for example, MIT).

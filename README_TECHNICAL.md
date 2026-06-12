# Technical Setup Guide (Boilerplate)

This document is a generic technical guide for a Playwright + TypeScript + BDD automation template.

## 1. Runtime Overview

- Test stack: Playwright + TypeScript + playwright-bdd.
- Typical execution flow: BDD generation and Playwright test run.
- Optional global setup can prepare authenticated state before tests.

## 2. Environment Strategy

Use environment-specific files for local runs and secret managers for CI.

Suggested pattern:

- .env.qa
- .env.stg
- .env.prod

Example variables:

- APP_BASE_URL
- E2E_USER
- E2E_PASSWORD
- ENV

## 3. Secret Management

Guidelines:

- Do not commit real credentials.
- Store secrets in CI secret vaults.
- Inject secrets only at runtime.

### Jenkins Example

Use credential bindings and pass secrets as environment variables in pipeline stages.

### GitHub Actions Example

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    env:
      ENV: qa
      E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}
      E2E_USER: ${{ vars.E2E_USER }}
      APP_BASE_URL: ${{ vars.APP_BASE_URL }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run bddgen
      - run: npm run test:qa
```

## 4. Pre-Commit Security Checks

Recommended controls:

- Block accidental commits of .env files.
- Scan staged content for tokens, keys and passwords.
- Enforce checks via local git hooks and CI validation.

## 5. Container And CI Notes

Recommended baseline:

- Use official Playwright container images in CI.
- Keep image tags aligned with Playwright version in package dependencies.
- Run browser jobs with shared memory configuration when needed.

## 6. Typical Pipeline Stages

1. Install dependencies.
2. Generate BDD artifacts.
3. Run tests (optionally sharded).
4. Merge reports.
5. Publish artifacts.

## 7. Troubleshooting Checklist

1. Review CI logs for failed step and command.
2. Open Playwright traces and HTML reports.
3. Validate runtime environment variables.
4. Reproduce locally with the same target environment.

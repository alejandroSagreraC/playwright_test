<div align="center">

# 🎭 Playwright BDD Boilerplate


### 🚀 Professional Starter Template for Enterprise Automation
*Built with Playwright, TypeScript, Cucumber BDD, and Page Object Model Architecture*

[![Quality](https://shields.io)](https://github.com)
![Node](https://shields.io)
![Playwright](https://shields.io)
![TypeScript](https://shields.io)
![BDD](https://shields.io)
![License](https://shields.io)

---
</div>

Professional starter template for end-to-end automation with Playwright, TypeScript, BDD (Gherkin), and Page Object Model architecture.

Designed as both a **production-ready baseline** for QA automation teams and a **polished public showcase** for GitHub portfolios.

---

## 🌟 Highlights

- **🎭 Playwright + TypeScript:** Built for lightning-fast and reliable browser automation.
- **🥒 Cucumber BDD Workflow:** Human-readable Gherkin feature files mapped to step definitions.
- **📐 Robust POM Structure:** Clean Page Object Models for maintainable UI interaction logic.
- **🌐 Multi-Environment Control:** Seamless execution switching between variables (`qa`, `stg`, `prod`).
- **🛡️ CI Quality Gates:** Fully integrated GitHub Actions workflows for linting, security, and testing.
- **🔑 Built-in Secret Checks:** Security scripts designed to protect public repositories from credential leaks.

---

## 📂 Project Structure

```text
playwright-bdd-boilerplate/
├── 📑 features/              # Gherkin .feature specifications
├── 🛠️ steps/                 # Step definitions and custom fixtures
├── 🧩 models/                # Page Object Models (POM)
├── ⚙️ config/                # Environment configuration and helpers
├── 📜 scripts/               # Utility scripts (security checks, analytics)
├── 🌐 docs/                  # GitHub Pages showcase site
└── 🔧 playwright.config.ts   # Core Playwright runtime configuration
```

---

## 💻 Requirements

- **Node.js** v20 or higher
- **npm** package manager

---

## ⚙️ Installation

Set up your development environment quickly with the following commands:

```bash
# Clone the project and install all dependencies
npm install

# Download and configure required browser binaries
npx playwright install
```

---

## 🚀 Quick Start

1. **Setup Environment:** Create an environment file from the provided template.
2. **Configure Variables:** Add the target URLs and endpoints for your application under test.
3. **Run Automation:** Generate the BDD runtime files and execute your tests instantly.

```bash
# Create local environment config
# For macOS/Linux:
cp .env.example .env.qa

# For Windows PowerShell:
Copy-Item .env.example .env.qa

# Compile Gherkin files and run tests
npm run bddgen
npm run test:qa
```

---

## 🔑 Environment Variables

> [!WARNING]  
> Never commit real credentials or production tokens to version control. Use placeholder values in configuration templates.

| Variable | Type | Description |
| :--- | :--- | :--- |
| `BASE_URL` | `string` | Base URL for the target web application |
| `ADMIN_USER` | `string` | Username credential for test authentication suites |
| `ADMIN_PASS` | `string` | Secure password extracted from local env or CI secret manager |
| `API_URL` | `string` | Root REST API base URL for integration testing |

### Example configuration (`.env.qa`)

```env
BASE_URL="https://your-host/"
ADMIN_USER="your-user@company.com"
ADMIN_PASS="CHANGEME_USE_LOCAL_OR_CI_SECRET"
API_URL="https://your-host"
```

---

## 🏃‍♂️ Test Execution

Execute specific test suites targeting different execution layers using native npm scripts:

```bash
# Execute environment-specific runs
npm run test:qa
npm run test:stg
npm run test:prod
```

### 🛠️ Developer Utility Scripts

- `npm run bddgen` — Compiles and synchronizes BDD feature layers.
- `npm run lint` — Analyzes TypeScript source code against quality rules.
- `npm run check:secrets` — Scans local project tree for accidental credentials.

---

## 📊 Test Reports & Triaging

Gain clear visibility into test executions using Playwright's native reporting engine:

* Rich **HTML Dashboards** with interactive results.
* Full **Trace Viewer** artifacts for visual debugging, network inspection, and execution triage.

To open and inspect your latest execution report, run:

```bash
npx playwright show-report
```

---

## ⛓️ CI Quality Gates

This repository includes a predefined, production-grade GitHub Actions workflow located at `.github/workflows/quality.yml`. Every code push triggers an isolated suite executing:

- 🏗️ **Clean Project Build** verifying code compilation.
- 🚨 **Source Code Linting** ensuring style guideline conformity.
- 📦 **Automated Dependency Audits** checking for vulnerable packages via `npm audit`.

---

## 🔒 Security Best Practices

1. **Keep `.env` files local:** Ensure configuration instances remain untracked by Git.
2. **Utilize Secrets Storage:** Inject confidential tokens dynamically via GitHub Secrets or CI environment vaults.
3. **Pre-commit Shields:** Always execute `npm run check:secrets` prior to merging code to prevent leakage.

---

## 🖥️ GitHub Pages Showcase

This repository contains a professional static landing page optimized for hosting on **GitHub Pages**, providing an external dashboard for project stakeholders and portfolios:
- 📎 View asset at `docs/index.html`

---

## 📄 License

Distributed under the **ISC License**. See the root configuration files for legal permissions.

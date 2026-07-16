const { execSync } = require('node:child_process');

const PLACEHOLDER_TOKENS = ['CHANGEME', 'PLACEHOLDER', 'REDACTED', 'EXAMPLE', 'YOUR_', '<', '${'];

// Client-specific keywords that must never appear in source code.
// This file is excluded from the check to avoid self-blocking.
const FORBIDDEN_CLIENT_KEYWORDS = ['myid', 'disney'];
const SELF_PATH = 'scripts/check-secrets.js';

function run(command) {
  try {
    return execSync(command, { encoding: 'utf-8' });
  } catch (error) {
    if (error && typeof error.stdout === 'string') {
      return error.stdout;
    }
    return '';
  }
}

function isEnvFile(path) {
  if (path === '.env') return true;
  if (!path.startsWith('.env.')) return false;
  return path !== '.env.example';
}

function hasRealValue(rawValue) {
  const value = rawValue.trim().replace(/^['"]|['"]$/g, '');
  if (!value) return false;
  return !PLACEHOLDER_TOKENS.some((token) => value.toUpperCase().includes(token));
}

function main() {
  const stagedFilesOutput = run('git diff --cached --name-only --diff-filter=ACMR');
  const stagedFiles = stagedFilesOutput
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean);

  const forbiddenEnvFiles = stagedFiles.filter(isEnvFile);

  if (forbiddenEnvFiles.length > 0) {
    console.error('❌ Commit blocked: Do not commit environment files with potential secrets.');
    console.error('Files:');
    for (const file of forbiddenEnvFiles) {
      console.error(` - ${file}`);
    }
    console.error('Use .env.example for templates and keep .env.* local/CI only.');
    process.exit(1);
  }

  const stagedDiff = run('git diff --cached --unified=0 --no-color');
  const lines = stagedDiff.split(/\r?\n/);

  const suspicious = [];

  for (const line of lines) {
    if (!line.startsWith('+') || line.startsWith('+++')) {
      continue;
    }

    const match = line.match(/\b(?:ADMIN_PASS|PASSWORD|PASS|ACCESS_TOKEN|API_KEY|CLIENT_SECRET)\b\s*[:=]\s*(.+)$/i);
    if (!match) {
      continue;
    }

    if (hasRealValue(match[1])) {
      suspicious.push(line.slice(1));
    }
  }

  if (suspicious.length > 0) {
    console.error('❌ Commit blocked: Potential secret values detected in staged changes.');
    console.error('Review and replace with environment-variable references or placeholders.');
    suspicious.slice(0, 10).forEach((entry) => console.error(` - ${entry}`));
    process.exit(1);
  }

  // --- Client keyword detection ---
  const stagedDiffFull = run('git diff --cached --no-color');
  const diffLines = stagedDiffFull.split(/\r?\n/);

  let currentFile = '';
  const clientKeywordHits = [];

  for (const diffLine of diffLines) {
    if (diffLine.startsWith('diff --git')) {
      const fileMatch = diffLine.match(/b\/(.+)$/);
      currentFile = fileMatch ? fileMatch[1] : '';
      continue;
    }

    // Skip self (this script contains the keywords as configuration)
    if (currentFile === SELF_PATH) continue;

    if (!diffLine.startsWith('+') || diffLine.startsWith('+++')) continue;

    const addedContent = diffLine.slice(1).toLowerCase();
    for (const keyword of FORBIDDEN_CLIENT_KEYWORDS) {
      if (addedContent.includes(keyword)) {
        clientKeywordHits.push({ file: currentFile, keyword, line: diffLine.slice(1).trim() });
      }
    }
  }

  if (clientKeywordHits.length > 0) {
    console.error('❌ Commit blocked: Forbidden client keyword(s) detected in staged changes.');
    console.error('Do not use client names, internal system names, or proprietary platform names in code.');
    for (const hit of clientKeywordHits.slice(0, 10)) {
      console.error(` - [${hit.keyword}] in ${hit.file}: ${hit.line}`);
    }
    process.exit(1);
  }

  console.log('✅ Secret check passed.');
}

main();

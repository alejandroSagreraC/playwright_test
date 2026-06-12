const { execSync } = require('node:child_process');

const PLACEHOLDER_TOKENS = ['CHANGEME', 'PLACEHOLDER', 'REDACTED', 'EXAMPLE', 'YOUR_', '<', '${'];

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

  console.log('✅ Secret check passed.');
}

main();

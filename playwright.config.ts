import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();
const ENV = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`), override: true });

const testDir = defineBddConfig({
  paths: ['features/**/*.feature'],
  steps: ['steps/**/*.ts'],
});

const storageStatePath = path.resolve(__dirname, 'playwright', '.auth', 'state.json');

export default defineConfig({
  globalSetup: require.resolve('./auth.setup'),
  testDir,
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['@saucelabs/playwright-reporter', { uploadAndParseResults: true }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 40000,
    permissions: ['geolocation', 'notifications'],
    contextOptions: {
      ignoreHTTPSErrors: true,
    }
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], storageState: storageStatePath } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], storageState: storageStatePath } },
    { name: 'edge', use: { ...devices['Desktop Edge'], storageState: storageStatePath } }
  ]
});
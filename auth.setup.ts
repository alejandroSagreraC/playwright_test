import { FullConfig, BrowserContext, Page, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';

const JWT_STORAGE_KEY = 'jwtToken';
const AUTH_TIMEOUT_MS = 60000;
const STORAGE_STATE_PATH = path.resolve(__dirname, 'playwright', '.auth', 'state.json');

type LocalStorageEntry = {
  name: string;
  value: string;
};

type StorageState = {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }>;
  origins: Array<{
    origin: string;
    localStorage: LocalStorageEntry[];
  }>;
};

function loadEnvironment(): void {
  dotenv.config();
  const envName = process.env.ENV || 'qa';
  dotenv.config({
    path: path.resolve(__dirname, `.env.${envName}`),
    override: true,
  });
}

function resolveOrigin(baseUrl: string): string {
  return new URL(baseUrl).origin;
}

function requireEnv(name: 'BASE_URL' | 'ADMIN_USER' | 'ADMIN_PASS'): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for UI login bootstrap.`);
  }

  return value;
}

function isAuthenticatedAppUrl(url: string): boolean {
  return !/\/login|\/callback/i.test(url);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, (matched) => String.fromCharCode(92) + matched);
}

async function waitForLoadingOverlay(page: Page): Promise<void> {
  const loadingOverlay = page.locator('.loading-overlay').first();
  if (await loadingOverlay.count()) {
    await loadingOverlay.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined);
  }
}

async function clickLoginEntryPoint(page: Page): Promise<void> {
  const loginButton = page.getByRole('button', { name: /login with/i });
  if (await loginButton.isVisible().catch(() => false)) {
    await waitForLoadingOverlay(page);
    await loginButton.click({ force: true });
  }
}

async function submitLoginCredentials(page: Page, username: string, password: string): Promise<void> {
  const passwordInput = page.locator('input[type="password"]').first();

  if (!(await passwordInput.isVisible().catch(() => false))) {
    const userInput = page.getByRole('textbox', { name: /correo|email|id/i }).first();
    await userInput.waitFor({ state: 'visible', timeout: AUTH_TIMEOUT_MS });
    await userInput.fill(username);
    await userInput.press('Enter');
  }

  await passwordInput.waitFor({ state: 'visible', timeout: AUTH_TIMEOUT_MS });
  await passwordInput.fill(password);
  await passwordInput.press('Enter');
}

async function ensureAuthenticatedSession(page: Page, baseUrl: string, username: string, password: string): Promise<void> {
  const checkInButton = page.getByRole('button', { name: 'Check-In' });

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: AUTH_TIMEOUT_MS });
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (await checkInButton.isVisible().catch(() => false)) {
    return;
  }

  await clickLoginEntryPoint(page);
  await submitLoginCredentials(page, username, password);

  const appOriginRegex = new RegExp(`^${escapeRegex(resolveOrigin(baseUrl))}`, 'i');
  await page.waitForURL(appOriginRegex, { timeout: AUTH_TIMEOUT_MS }).catch(() => undefined);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: AUTH_TIMEOUT_MS });
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (!isAuthenticatedAppUrl(page.url())) {
    throw new Error('UI login did not reach an authenticated app URL.');
  }

  if (!(await checkInButton.isVisible().catch(() => false))) {
    throw new Error('UI login completed but Check-In menu is not visible on home.');
  }
}

async function persistAuthenticatedStorageState(context: BrowserContext, statePath: string, baseUrl: string): Promise<void> {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await context.storageState({ path: statePath });

  const storedState = JSON.parse(await fs.readFile(statePath, 'utf-8')) as StorageState;
  const appOrigin = resolveOrigin(baseUrl);
  const appOriginState = storedState.origins.find((originState) => originState.origin === appOrigin);
  const token = appOriginState?.localStorage.find((entry) => entry.name === JWT_STORAGE_KEY)?.value;

  if (!token) {
    throw new Error('UI login succeeded but jwtToken was not saved in storageState.');
  }
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  loadEnvironment();

  const baseUrl = requireEnv('BASE_URL');
  const adminUser = requireEnv('ADMIN_USER');
  const adminPass = requireEnv('ADMIN_PASS');
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    await ensureAuthenticatedSession(page, baseUrl, adminUser, adminPass);
    await persistAuthenticatedStorageState(context, STORAGE_STATE_PATH, baseUrl);
  } finally {
    await browser.close();
  }
}

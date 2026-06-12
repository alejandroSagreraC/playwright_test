import { createBdd } from 'playwright-bdd';
import { test, expect } from '../fixtures';

const { Given, Then } = createBdd(test);

Given('User navigates to APP Home with token session', async ({ page }) => {
  await page.goto(process.env.BASE_URL || '/', { waitUntil: 'domcontentloaded' });
});

Then('Login should be successful', async ({ loginPage }) => {
  const homeState = await loginPage.getHomeState();
  expect(homeState.path, 'The browser remained on login/callback and did not reach authenticated home.').not.toMatch(/\/login|\/callback/);
  await expect(loginPage.mainTitle).toBeVisible({ timeout: 70000 });
  await expect(loginPage.checkInButton).toBeVisible({ timeout: 70000 });
  expect(homeState.loginButtonCount).toBe(0);
});

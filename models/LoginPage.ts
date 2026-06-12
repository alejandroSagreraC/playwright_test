import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly mainTitle: Locator;
  readonly checkInButton: Locator;
  readonly loginButton: Locator;

  /**
   * Builds a page object with stable locators for the login screen.
   */
  constructor(page: Page) {
    this.page = page;
    this.mainTitle = page.getByRole('heading', { name: 'Main Title' });
    this.checkInButton = page.getByRole('button', { name: 'Check-In' });
    this.loginButton = page.getByRole('button', { name: /login with/i });
  }

  /**
   * Captures the current home/login state used by BDD steps for assertions.
   */
  async getHomeState(): Promise<{ path: string; loginButtonCount: number }> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle').catch(() => undefined);

    let path: string;
    try {
      path = new URL(this.page.url()).pathname.toLowerCase();
    } catch {
      path = this.page.url().toLowerCase();
    }

    return {
      path,
      loginButtonCount: await this.loginButton.count(),
    };
  }
}
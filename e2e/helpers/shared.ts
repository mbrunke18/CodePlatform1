import { type Page, expect } from '@playwright/test';

/**
 * Waits for the page body to contain meaningful content before returning its text.
 * Replaces all waitForTimeout patterns — uses condition-based polling instead.
 */
export async function getStableBodyText(page: Page, minLen = 80): Promise<string> {
  await page.waitForLoadState('load');
  await expect.poll(
    async () => (await page.locator('body').innerText()).trim().length,
    { timeout: 15000, intervals: [250, 500, 1000] }
  ).toBeGreaterThan(minLen);
  return page.locator('body').innerText();
}

/**
 * Navigates to a path and waits for stable content.
 */
export async function gotoStable(page: Page, path: string, minLen = 80): Promise<string> {
  await page.goto(path);
  return getStableBodyText(page, minLen);
}

/**
 * Waits for a redirect to complete and returns the final URL.
 */
export async function waitForRedirect(page: Page, path: string): Promise<string> {
  await page.goto(path);
  await page.waitForLoadState('load');
  await expect.poll(() => page.url(), { timeout: 8000 }).not.toMatch(new RegExp(`${path.replace('/', '\\/')}$`));
  return page.url();
}

import { expect, type Page } from '@playwright/test';

/** Asserts body does not contain any of the retired phrases. */
export async function assertNoRetiredTerms(bodyText: string, path: string): Promise<void> {
  const retired = [
    'Pilot Program', 'Pilot Access', 'Now in Pilot',
    'AI Confidence', 'speed advantage',
    '340×', '360×',
  ];
  for (const term of retired) {
    expect(bodyText, `"${term}" must not appear on ${path}`).not.toContain(term);
  }
}

/** Asserts the page carries the canonical 3,600× / 12-minute thesis. */
export function assertPlatformThesis(bodyText: string): void {
  const hasThesis =
    bodyText.includes('12 minutes') ||
    bodyText.includes('12-minute') ||
    bodyText.includes('3,600') ||
    bodyText.includes('30 days');
  expect(hasThesis, 'Platform thesis (12 minutes / 3,600×) must be present').toBe(true);
}

/** Asserts Founding Partner language is present. */
export function assertFoundingPartnerLanguage(bodyText: string): void {
  const hasLanguage =
    /founding partner|executive access|request executive access|access request|request access/i.test(bodyText);
  expect(hasLanguage, 'Founding Partner language must be present').toBe(true);
}

/** Asserts a visible element exists with a given data-testid. */
export async function assertTestId(page: Page, testId: string): Promise<void> {
  await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible({ timeout: 10000 });
}

/** Asserts page has at least one form input. */
export async function assertHasForm(page: Page): Promise<void> {
  const hasForm =
    (await page.locator('input').count()) > 0 ||
    (await page.locator('textarea').count()) > 0 ||
    (await page.locator('form').count()) > 0;
  expect(hasForm, 'Page must contain a form or input').toBe(true);
}

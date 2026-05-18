import { test, expect, Page } from '@playwright/test';

/**
 * VaughnMartin Readiness OS — Core Demo Flow Tests
 *
 * Verifies that critical demo and lead-generation paths work end-to-end
 * using the current VaughnMartin brand and platform structure.
 */

/**
 * Waits for the page body to contain meaningful content before returning
 * its text. Prevents flaky failures caused by hydration/timing races where
 * innerText() returns an empty string on first read.
 */
async function getStableBodyText(page: Page, minLen = 80): Promise<string> {
  await page.waitForLoadState('load');
  await expect.poll(
    async () => (await page.locator('body').innerText()).trim().length,
    { timeout: 15000, intervals: [250, 500, 1000] }
  ).toBeGreaterThan(minLen);
  return page.locator('body').innerText();
}

test.describe('Homepage — Brand & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2500);
  });

  test('homepage loads and carries VaughnMartin branding', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toMatch(/vaughnmartin/i);
  });

  test('homepage does not carry retired "Phronex" branding', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Phronex');
    expect(bodyText).not.toContain('Kairosync');
  });

  test('homepage carries the canonical product thesis', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    const hasThesis =
      /readiness os|readiness protocol|12 minutes|3,600|response is ready|before the trigger/i.test(bodyText);
    expect(hasThesis).toBe(true);
  });

  test('primary CTA button is visible and clickable', async ({ page }) => {
    await page.waitForTimeout(1000);
    const ctaButton = page
      .locator('a, button')
      .filter({ hasText: /Get Started|Request Access|Founding Partner|Apply|Demo|Learn More/i })
      .first();
    await expect(ctaButton).toBeVisible({ timeout: 10000 });
  });
});

test.describe('12-Minute Test Drive — Lead Generation Flow', () => {
  test('test drive page loads', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('test drive page contains readiness or 12-minute messaging', async ({ page }) => {
    await page.goto('/12-minute-experience');
    const bodyText = await getStableBodyText(page);
    const hasExpectedContent =
      /12|readiness|protocol|trigger|execute/i.test(bodyText);
    expect(hasExpectedContent).toBe(true);
  });
});

test.describe('Playbook Library — Browse Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playbook-library');
  });

  test('playbook library page loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('playbook library shows protocol or playbook content', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    const hasContent =
      /readiness protocol|protocol|playbook|170/i.test(bodyText);
    expect(hasContent).toBe(true);
  });

  test('playbook library uses approved domain labels', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Offense');
    expect(bodyText).not.toContain('Special Teams');
  });
});

test.describe('Request Access — Founding Partner Flow', () => {
  test('request-access page loads', async ({ page }) => {
    await page.goto('/request-access');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('request-access page uses Founding Partner or Executive Access language', async ({ page }) => {
    await page.goto('/request-access');
    const bodyText = await getStableBodyText(page);
    const hasAccessLanguage =
      /founding partner|executive access|request executive access|access request|request access/i.test(bodyText);
    expect(hasAccessLanguage).toBe(true);
  });

  test('request-access page does not show retired Pilot Program language', async ({ page }) => {
    await page.goto('/request-access');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Pilot Program');
    expect(bodyText).not.toContain('Pilot Access');
    expect(bodyText).not.toContain('Now in Pilot');
  });
});

test.describe('Executive Dashboard', () => {
  test('executive dashboard loads', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('executive dashboard shows readiness or score content (or redirects to access gate)', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('load');
    const url = page.url();
    if (url.includes('request-access')) {
      // Auth-gated — redirect to access gate is expected and correct
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    } else {
      const bodyText = await getStableBodyText(page);
      const hasContent =
        /readiness|score|protocol|dashboard/i.test(bodyText);
      expect(hasContent).toBe(true);
    }
  });
});

test.describe('Intelligence Demo', () => {
  test('intelligence demo page loads', async ({ page }) => {
    await page.goto('/intelligence-demo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('intelligence demo shows signal or intelligence content', async ({ page }) => {
    await page.goto('/intelligence-demo');
    const bodyText = await getStableBodyText(page);
    // /intelligence-demo may redirect to /industry-demos — both are valid
    const hasContent =
      /industry|demo|scenario|protocol|signal|intelligence|readiness|trigger/i.test(bodyText);
    expect(hasContent).toBe(true);
  });

  test('intelligence demo does not use retired AI Confidence label', async ({ page }) => {
    await page.goto('/intelligence-demo');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('AI Confidence');
  });
});

test.describe('Contact / Founding Partner CTA', () => {
  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('contact page contains a form or contact mechanism', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1000);
    const hasForm =
      (await page.locator('input').count()) > 0 ||
      (await page.locator('textarea').count()) > 0 ||
      (await page.locator('form').count()) > 0;
    expect(hasForm).toBe(true);
  });
});

test.describe('URL Redirect Integrity', () => {
  test('/dashboard redirects away from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1500);
    const url = page.url();
    const redirected =
      url.includes('request-access') ||
      url.includes('playbooks') ||
      url.includes('mission-control') ||
      !url.match(/\/dashboard$/);
    expect(redirected).toBe(true);
  });

  test('/scenarios redirects away from /scenarios', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForTimeout(1500);
    const url = page.url();
    const redirected =
      url.includes('playbooks') ||
      url.includes('request-access') ||
      !url.match(/\/scenarios$/);
    expect(redirected).toBe(true);
  });
});

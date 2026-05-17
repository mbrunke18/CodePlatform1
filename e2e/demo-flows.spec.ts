import { test, expect } from '@playwright/test';

/**
 * VaughnMartin Readiness OS — Core Demo Flow Tests
 *
 * Verifies that critical demo and lead-generation paths work end-to-end
 * using the current VaughnMartin brand and platform structure.
 */

test.describe('Homepage — Brand & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads and carries VaughnMartin branding', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('VaughnMartin');
  });

  test('homepage does not carry retired "Phronex" branding', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Phronex');
    expect(bodyText).not.toContain('Kairosync');
  });

  test('homepage carries the canonical product thesis', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    const hasThesis =
      bodyText.includes('Readiness OS') ||
      bodyText.includes('Readiness Protocol') ||
      bodyText.includes('12 minutes') ||
      bodyText.includes('3,600');
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
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    const hasExpectedContent =
      bodyText.includes('12') ||
      bodyText.includes('Readiness') ||
      bodyText.includes('Protocol') ||
      bodyText.includes('trigger');
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
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    const hasContent =
      bodyText.includes('Protocol') ||
      bodyText.includes('Playbook') ||
      bodyText.includes('170');
    expect(hasContent).toBe(true);
  });

  test('playbook library uses approved domain labels', async ({ page }) => {
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Offense');
    expect(bodyText).not.toContain('Special Teams');
  });
});

test.describe('Request Access — Founding Partner Flow', () => {
  test('request-access page loads', async ({ page }) => {
    await page.goto('/request-access');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('request-access page uses Founding Partner language', async ({ page }) => {
    await page.goto('/request-access');
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    const hasFoundingPartner =
      bodyText.includes('Founding Partner') ||
      bodyText.includes('Access');
    expect(hasFoundingPartner).toBe(true);
  });

  test('request-access page does not show retired Pilot Program language', async ({ page }) => {
    await page.goto('/request-access');
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
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

  test('executive dashboard shows readiness or score content', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    const hasContent =
      bodyText.includes('Readiness') ||
      bodyText.includes('Score') ||
      bodyText.includes('Protocol') ||
      bodyText.includes('Dashboard');
    expect(hasContent).toBe(true);
  });
});

test.describe('Intelligence Demo', () => {
  test('intelligence demo page loads', async ({ page }) => {
    await page.goto('/intelligence-demo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('intelligence demo shows signal or intelligence content', async ({ page }) => {
    await page.goto('/intelligence-demo');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    const hasContent =
      bodyText.includes('Signal') ||
      bodyText.includes('Intelligence') ||
      bodyText.includes('Protocol') ||
      bodyText.includes('scenario');
    expect(hasContent).toBe(true);
  });

  test('intelligence demo does not use retired AI Confidence label', async ({ page }) => {
    await page.goto('/intelligence-demo');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
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
    // Auth guard fires before inner redirect — destination is request-access or playbooks
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
    // Routes to /playbooks (may gate to request-access if auth-protected)
    const url = page.url();
    const redirected =
      url.includes('playbooks') ||
      url.includes('request-access') ||
      !url.match(/\/scenarios$/);
    expect(redirected).toBe(true);
  });
});

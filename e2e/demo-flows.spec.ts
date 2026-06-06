import { test, expect } from '@playwright/test';
import { gotoStable } from './helpers/shared';
import { assertPlatformThesis, assertFoundingPartnerLanguage, assertHasForm } from './helpers/assertions';
import { RequestAccessPage } from './pages/requestAccessPage';

/**
 * VaughnMartin Readiness OS — Core Demo Flow Tests
 * Zero fixed sleeps — all waits are condition-based.
 */

test.describe('Homepage — Brand & Navigation', () => {
  test('loads with VaughnMartin branding', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).toMatch(/vaughnmartin/i);
  });

  test('does not carry retired Phronex branding', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).not.toContain('Phronex');
    expect(body).not.toContain('Kairosync');
  });

  test('carries the canonical product thesis', async ({ page }) => {
    const body = await gotoStable(page, '/');
    assertPlatformThesis(body);
  });

  test('primary CTA button is visible', async ({ page }) => {
    await page.goto('/');
    const cta = page
      .locator('a, button')
      .filter({ hasText: /Get Started|Request Access|Founding Partner|Apply|Demo|Learn More/i })
      .first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test('Founding Partner nav CTA has correct data-testid', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="nav-founding-partner-cta"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('12-Minute Test Drive — Lead Generation Flow', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('scenario cards render', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('[data-testid^="scenario-card-"]').first()).toBeVisible({ timeout: 12000 });
  });

  test('contains readiness or 12-minute messaging', async ({ page }) => {
    const body = await gotoStable(page, '/12-minute-experience');
    expect(body).toMatch(/12|readiness|protocol|trigger|execute/i);
  });
});

test.describe('Playbook Library — Browse Experience', () => {
  test('loads', async ({ page }) => {
    await page.goto('/playbook-library');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('shows protocol or playbook content', async ({ page }) => {
    const body = await gotoStable(page, '/playbook-library');
    expect(body).toMatch(/readiness protocol|protocol|playbook|170/i);
  });

  test('uses approved domain labels', async ({ page }) => {
    const body = await gotoStable(page, '/playbook-library');
    expect(body).not.toContain('Offense');
    expect(body).not.toContain('Special Teams');
  });
});

test.describe('Request Access — Founding Partner Flow (page object)', () => {
  test('page loads', async ({ page }) => {
    const rap = new RequestAccessPage(page);
    await rap.goto();
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('uses Founding Partner language', async ({ page }) => {
    const rap = new RequestAccessPage(page);
    await rap.goto();
    await rap.assertFoundingPartnerLanguage();
  });

  test('submit button is visible', async ({ page }) => {
    const rap = new RequestAccessPage(page);
    await rap.goto();
    expect(await rap.isSubmitVisible()).toBe(true);
  });

  test('does not show retired Pilot Program language', async ({ page }) => {
    const rap = new RequestAccessPage(page);
    await rap.goto();
    await rap.assertNoRetiredPilotLanguage();
  });
});

test.describe('Founding Partner Program', () => {
  test('apply CTA has correct data-testid', async ({ page }) => {
    await page.goto('/founding-partner-program');
    await expect(page.locator('[data-testid="founding-partner-apply-cta"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Executive Dashboard', () => {
  test('loads or redirects to access gate', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('load');
    const url = page.url();
    if (url.includes('request-access')) {
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    } else {
      const body = await gotoStable(page, '/executive-dashboard');
      expect(body).toMatch(/readiness|score|protocol|dashboard/i);
    }
  });
});

test.describe('Intelligence Demo', () => {
  test('page loads with intelligence content', async ({ page }) => {
    const body = await gotoStable(page, '/intelligence-demo');
    expect(body).toMatch(/industry|demo|scenario|protocol|signal|intelligence|readiness|trigger/i);
  });

  test('does not use retired AI Confidence label', async ({ page }) => {
    const body = await gotoStable(page, '/intelligence-demo');
    expect(body).not.toContain('AI Confidence');
  });
});

test.describe('Contact / Founding Partner CTA', () => {
  test('contact page loads with a form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input, textarea, form').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('URL Redirect Integrity', () => {
  test('/dashboard redirects away from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).not.toMatch(/\/dashboard$/);
  });

  test('/scenarios redirects away from /scenarios', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).not.toMatch(/\/scenarios$/);
  });
});

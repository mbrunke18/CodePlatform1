import { test, expect } from '@playwright/test';
import { gotoStable, waitForRedirect } from './helpers/shared';
import { assertPlatformThesis, assertFoundingPartnerLanguage, assertTestId } from './helpers/assertions';

/**
 * Smoke Suite — runs on every PR.
 * Covers: homepage, request-access happy path, one API endpoint, one demo route.
 * Fast, reliable, zero fixed sleeps.
 */

test.describe('Smoke — Homepage', () => {
  test('loads with VaughnMartin brand and platform thesis', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).toMatch(/VaughnMartin/i);
    assertPlatformThesis(body);
  });

  test('nav Founding Partner CTA is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="nav-founding-partner-cta"]')).toBeVisible({ timeout: 10000 });
  });

  test('homepage does not carry retired metrics', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).not.toContain('340×');
    expect(body).not.toContain('360×');
  });
});

test.describe('Smoke — Request Access', () => {
  test('page loads with Founding Partner language', async ({ page }) => {
    const body = await gotoStable(page, '/request-access');
    assertFoundingPartnerLanguage(body);
  });

  test('submit button is present', async ({ page }) => {
    await page.goto('/request-access');
    await assertTestId(page, 'request-access-submit');
  });

  test('no retired Pilot language', async ({ page }) => {
    const body = await gotoStable(page, '/request-access');
    expect(body).not.toContain('Pilot Program');
    expect(body).not.toContain('Pilot Access');
  });
});

test.describe('Smoke — API Health', () => {
  test('GET /api/playbooks/metadata returns 200', async ({ request }) => {
    const res = await request.get('/api/playbooks/metadata');
    expect(res.status()).toBe(200);
  });

  test('GET /api/preparedness/score returns 200 or 401', async ({ request }) => {
    const res = await request.get('/api/preparedness/score');
    expect([200, 401]).toContain(res.status());
  });
});

test.describe('Smoke — Demo Route', () => {
  test('/demo-hub loads with demo content', async ({ page }) => {
    const body = await gotoStable(page, '/demo-hub');
    expect(body).toMatch(/demo|protocol|scenario|readiness/i);
  });

  test('/12-minute-experience loads scenario cards', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('[data-testid^="scenario-card-"]').first()).toBeVisible({ timeout: 12000 });
  });
});

test.describe('Smoke — Redirect Integrity', () => {
  test('/demos redirects to /demo-hub', async ({ page }) => {
    await page.goto('/demos');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).toMatch(/demo-hub/);
  });

  test('/sizzle redirects to /12-minute-experience', async ({ page }) => {
    await page.goto('/sizzle');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).toMatch(/12-minute-experience/);
  });
});

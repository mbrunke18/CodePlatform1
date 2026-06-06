import { test, expect } from '@playwright/test';
import { gotoStable, getStableBodyText } from './helpers/shared';
import { assertNoRetiredTerms, assertPlatformThesis, assertFoundingPartnerLanguage, assertHasForm } from './helpers/assertions';

/**
 * VaughnMartin Readiness OS — Comprehensive Platform E2E Tests
 *
 * Tests public-accessible routes only. Auth-gated routes redirect to /request-access.
 * Zero fixed sleeps — all waits are condition-based.
 */

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────

test.describe('Homepage — Core Messaging', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('homepage carries VaughnMartin brand', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).toMatch(/vaughnmartin/i);
  });

  test('homepage carries Readiness OS product name', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).toMatch(/readiness/i);
  });

  test('homepage carries the 12-minute or 3,600× thesis', async ({ page }) => {
    const body = await gotoStable(page, '/');
    assertPlatformThesis(body);
  });

  test('homepage has a visible primary CTA', async ({ page }) => {
    await page.goto('/');
    const cta = page
      .locator('a, button')
      .filter({ hasText: /Get Started|Request Access|Founding Partner|Apply|Demo|Learn More|See It Work/i })
      .first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test('homepage does not carry retired Phronex brand', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).not.toContain('Phronex');
    expect(body).not.toContain('Kairosync');
  });

  test('homepage does not show retired speed metrics', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).not.toContain('340×');
    expect(body).not.toContain('360×');
  });
});

// ─── MARKETING PAGES ─────────────────────────────────────────────────────────

test.describe('Public Marketing Pages — Load & Content', () => {
  const publicPages = [
    { path: '/how-it-works',        keyword: 'Readiness' },
    { path: '/how-it-executes',     keyword: '12' },
    { path: '/pricing',             keyword: 'Founding Partner' },
    { path: '/contact',             keyword: 'contact' },
    { path: '/proof-story',         keyword: 'Readiness' },
    { path: '/roi-calculator',      keyword: 'ROI' },
    { path: '/executive-brief',     keyword: 'Readiness OS' },
    { path: '/security-compliance', keyword: 'Security' },
    { path: '/design-logic',        keyword: 'Design Logic' },
  ];

  for (const { path, keyword } of publicPages) {
    test(`${path} loads and contains expected content`, async ({ page }) => {
      const body = await gotoStable(page, path);
      expect(body.toLowerCase()).toContain(keyword.toLowerCase());
    });
  }
});

// ─── CONVERSION PAGES ─────────────────────────────────────────────────────────

test.describe('Conversion Pages — Buyer Decision Suite', () => {
  test('/cost-of-inaction loads with scenario content', async ({ page }) => {
    const body = await gotoStable(page, '/cost-of-inaction');
    expect(body).toContain('30');
    expect(body).toContain('12');
  });

  test('/cost-of-inaction does not use retired metrics', async ({ page }) => {
    const body = await gotoStable(page, '/cost-of-inaction');
    expect(body).not.toContain('340×');
    expect(body).not.toContain('360×');
  });

  test('/first-90-days loads with phase content', async ({ page }) => {
    const body = await gotoStable(page, '/first-90-days');
    expect(body).toContain('90');
  });

  test('/first-90-days contains milestone content', async ({ page }) => {
    const body = await gotoStable(page, '/first-90-days');
    expect(body).toMatch(/Day|Phase|milestone/i);
  });

  test('/board-memo loads with memo content', async ({ page }) => {
    const body = await gotoStable(page, '/board-memo');
    expect(body).toMatch(/Memo|CFO|Board/i);
  });

  test('/board-memo has form inputs', async ({ page }) => {
    await page.goto('/board-memo');
    await expect(page.locator('input').first()).toBeVisible({ timeout: 10000 });
  });

  test('/founding-partner loads with Founding Partner language', async ({ page }) => {
    const body = await gotoStable(page, '/founding-partner');
    expect(body).toContain('Founding Partner');
  });

  test('/founding-partner does not use Pilot language', async ({ page }) => {
    const body = await gotoStable(page, '/founding-partner');
    expect(body).not.toContain('Pilot Program');
    expect(body).not.toContain('Pilot Access');
  });

  test('/buyer-decision-packet loads with 90-day content', async ({ page }) => {
    const body = await gotoStable(page, '/buyer-decision-packet', 200);
    expect(body).toMatch(/90-day|90 day|90 days|\b90\b/i);
    expect(body).toMatch(/founding partner|executive access/i);
  });

  test('/buyer-decision-packet has governance content', async ({ page }) => {
    const body = await gotoStable(page, '/buyer-decision-packet');
    expect(body).toMatch(/Governance|authority/i);
  });
});

// ─── 12-MINUTE TEST DRIVE ─────────────────────────────────────────────────────

test.describe('12-Minute Test Drive — Public Lead Gen', () => {
  test('test drive page loads', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('scenario cards are present', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('[data-testid^="scenario-card-"]').first()).toBeVisible({ timeout: 12000 });
  });

  test('test drive contains readiness/12-minute content', async ({ page }) => {
    const body = await gotoStable(page, '/12-minute-experience');
    expect(body).toMatch(/12|readiness|protocol|trigger|execute/i);
  });

  test('test drive does not use retired Pilot language', async ({ page }) => {
    const body = await gotoStable(page, '/12-minute-experience');
    expect(body).not.toContain('Pilot Program');
  });
});

// ─── REQUEST ACCESS / CONTACT ─────────────────────────────────────────────────

test.describe('Request Access & Contact', () => {
  test('/request-access loads', async ({ page }) => {
    await page.goto('/request-access');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/request-access submit button is present', async ({ page }) => {
    await page.goto('/request-access');
    await expect(page.locator('[data-testid="request-access-submit"]')).toBeVisible({ timeout: 10000 });
  });

  test('/request-access uses Founding Partner language', async ({ page }) => {
    const body = await gotoStable(page, '/request-access');
    assertFoundingPartnerLanguage(body);
  });

  test('/request-access does not use retired Pilot language', async ({ page }) => {
    const body = await gotoStable(page, '/request-access');
    expect(body).not.toContain('Pilot Program');
    expect(body).not.toContain('Pilot Access');
    expect(body).not.toContain('Now in Pilot');
  });

  test('/contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/contact page has a form or input', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input, textarea, form').first()).toBeVisible({ timeout: 10000 });
  });

  test('/contact does not use retired Pilot language', async ({ page }) => {
    const body = await gotoStable(page, '/contact');
    expect(body).not.toContain('Pilot Program');
    expect(body).not.toContain('Pilot Access');
  });
});

// ─── PROTOCOL LIBRARY ─────────────────────────────────────────────────────────

test.describe('Protocol Library — Public Browse', () => {
  test('/playbook-library loads', async ({ page }) => {
    await page.goto('/playbook-library');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/playbook-library shows protocol content', async ({ page }) => {
    const body = await gotoStable(page, '/playbook-library');
    expect(body).toMatch(/readiness protocol|protocol|playbook|170/i);
  });

  test('/playbook-library does not use retired domain labels', async ({ page }) => {
    const body = await gotoStable(page, '/playbook-library');
    expect(body).not.toContain('Special Teams');
  });
});

// ─── DEMO PAGES ───────────────────────────────────────────────────────────────

test.describe('Demo Hub & Scenario Demos', () => {
  test('/demo-hub loads with content', async ({ page }) => {
    const body = await gotoStable(page, '/demo-hub');
    expect(body).toMatch(/demo|protocol|scenario|readiness/i);
  });

  test('/master-demo loads', async ({ page }) => {
    await page.goto('/master-demo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/industry-demos loads', async ({ page }) => {
    await page.goto('/industry-demos');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });
});

// ─── INVESTOR PAGES ───────────────────────────────────────────────────────────

test.describe('Investor Pages', () => {
  test('/investors loads with investor content', async ({ page }) => {
    const body = await gotoStable(page, '/investors');
    expect(body).toMatch(/readiness|investor|vaughnmartin/i);
  });

  test('/investors does not use retired metric framing', async ({ page }) => {
    const body = await gotoStable(page, '/investors');
    expect(body).not.toContain('340×');
    expect(body).not.toContain('360×');
  });

  test('/investor-landing carries canonical tagline', async ({ page }) => {
    const body = await gotoStable(page, '/investor-landing');
    expect(body).toMatch(/trigger|3,600|12 minutes|response is ready|before the trigger fires/i);
  });

  test('/investor-presentation loads with access gate or content', async ({ page }) => {
    const body = await gotoStable(page, '/investor-presentation');
    expect(body).toMatch(/investor|vaughnmartin|readiness|access|password|enter/i);
  });
});

// ─── REDIRECTS ────────────────────────────────────────────────────────────────

test.describe('Redirects — Final URL and Content', () => {
  test('/dashboard redirects away and renders a page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).not.toMatch(/\/dashboard$/);
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  });

  test('/scenarios redirects away', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).not.toMatch(/\/scenarios$/);
  });

  test('/demos redirects to /demo-hub and renders content', async ({ page }) => {
    await page.goto('/demos');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).toMatch(/demo-hub/);
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  });

  test('/command-center redirects and renders a page', async ({ page }) => {
    await page.goto('/command-center');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).not.toMatch(/\/command-center$/);
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  });

  test('/sizzle redirects to 12-minute-experience', async ({ page }) => {
    await page.goto('/sizzle');
    await page.waitForLoadState('load');
    await expect.poll(() => page.url(), { timeout: 8000 }).toMatch(/12-minute-experience/);
  });
});

// ─── PROTOCOL BUILDER ─────────────────────────────────────────────────────────

test.describe('Protocol Builder — Public Builder Flow', () => {
  test('/protocol-builder loads', async ({ page }) => {
    await page.goto('/protocol-builder');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Protocol Builder shows template or step content', async ({ page }) => {
    const body = await gotoStable(page, '/protocol-builder');
    expect(body).toMatch(/template|quick|protocol/i);
  });

  test('Protocol Builder has step navigation', async ({ page }) => {
    await page.goto('/protocol-builder');
    const hasSteps =
      (await page.locator('button').filter({ hasText: /next|continue|step/i }).count()) > 0 ||
      (await page.locator('[class*="step"], [class*="Step"]').count()) > 0;
    expect(hasSteps).toBe(true);
  });
});

// ─── INDUSTRY DEMOS ───────────────────────────────────────────────────────────

test.describe('Industry Demos — Core Scenarios', () => {
  const coreScenarios = [
    { path: '/demo/ransomware',    name: 'Ransomware' },
    { path: '/demo/market-entry',  name: 'Market Entry' },
    { path: '/demo/product-launch', name: 'Product Launch' },
  ];

  for (const { path, name } of coreScenarios) {
    test(`${name} demo (${path}) loads with content`, async ({ page }) => {
      const body = await gotoStable(page, path);
      expect(body).toMatch(/market|entry|scenario|demo|protocol|readiness|trigger|12/i);
    });
  }
});

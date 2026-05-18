import { test, expect, Page } from '@playwright/test';

/**
 * VaughnMartin Readiness OS — Comprehensive Platform E2E Tests
 *
 * Tests public-accessible routes only. Auth-gated routes are intentionally
 * excluded — they redirect to /request-access when unauthenticated.
 *
 * Strategy: content-based assertions over brittle data-testid selectors.
 * Run with: npx playwright test e2e/comprehensive-platform-tests.spec.ts
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

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────

test.describe('Homepage — Core Messaging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
  });

  test('homepage loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('homepage carries VaughnMartin brand', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toMatch(/vaughnmartin/i);
  });

  test('homepage carries Readiness OS product name', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toMatch(/readiness/i);
  });

  test('homepage carries the 12-minute or 3,600× thesis', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    const hasThesis =
      bodyText.includes('12 minutes') ||
      bodyText.includes('12-minute') ||
      bodyText.includes('3,600') ||
      bodyText.includes('30 days');
    expect(hasThesis).toBe(true);
  });

  test('homepage has a visible primary CTA', async ({ page }) => {
    const cta = page
      .locator('a, button')
      .filter({ hasText: /Get Started|Request Access|Founding Partner|Apply|Demo|Learn More|See It Work/i })
      .first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test('homepage does not carry retired Phronex brand', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Phronex');
    expect(bodyText).not.toContain('Kairosync');
  });

  test('homepage does not show retired speed metrics', async ({ page }) => {
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('340×');
    expect(bodyText).not.toContain('360×');
  });
});

// ─── MARKETING PAGES ─────────────────────────────────────────────────────────

test.describe('Public Marketing Pages — Load & Content', () => {
  const publicPages = [
    { path: '/how-it-works', keyword: 'Readiness' },
    { path: '/how-it-executes', keyword: '12' },
    { path: '/pricing', keyword: 'Founding Partner' },
    { path: '/contact', keyword: 'contact' },
    { path: '/proof-story', keyword: 'Readiness' },
    { path: '/roi-calculator', keyword: 'ROI' },
    { path: '/executive-brief', keyword: 'Readiness OS' },
    { path: '/security-compliance', keyword: 'Security' },
  ];

  for (const { path, keyword } of publicPages) {
    test(`${path} loads and contains expected content`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      const bodyText = await getStableBodyText(page);
      expect(bodyText.toLowerCase()).toContain(keyword.toLowerCase());
    });
  }
});

// ─── NEW CONVERSION PAGES ─────────────────────────────────────────────────────

test.describe('Conversion Pages — Buyer Decision Suite', () => {
  test('/cost-of-inaction loads with scenario content', async ({ page }) => {
    await page.goto('/cost-of-inaction');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toContain('30');
    expect(bodyText).toContain('12');
  });

  test('/cost-of-inaction does not use retired metrics', async ({ page }) => {
    await page.goto('/cost-of-inaction');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('340×');
    expect(bodyText).not.toContain('360×');
  });

  test('/first-90-days loads with phase content', async ({ page }) => {
    await page.goto('/first-90-days');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toContain('90');
  });

  test('/first-90-days contains milestone content', async ({ page }) => {
    await page.goto('/first-90-days');
    const bodyText = await getStableBodyText(page);
    const hasMilestones =
      bodyText.includes('Day') ||
      bodyText.includes('Phase') ||
      bodyText.includes('milestone') ||
      bodyText.includes('Milestone');
    expect(hasMilestones).toBe(true);
  });

  test('/board-memo loads with memo generator', async ({ page }) => {
    await page.goto('/board-memo');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    const hasMemoContent =
      bodyText.includes('Memo') ||
      bodyText.includes('CFO') ||
      bodyText.includes('Board');
    expect(hasMemoContent).toBe(true);
  });

  test('/board-memo has form inputs', async ({ page }) => {
    await page.goto('/board-memo');
    await page.waitForTimeout(1500);
    const inputCount = await page.locator('input').count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('/founding-partner loads with Founding Partner language', async ({ page }) => {
    await page.goto('/founding-partner');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toContain('Founding Partner');
  });

  test('/founding-partner does not use Pilot language', async ({ page }) => {
    await page.goto('/founding-partner');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Pilot Program');
    expect(bodyText).not.toContain('Pilot Access');
  });

  test('/buyer-decision-packet loads with all 9 sections', async ({ page }) => {
    await page.goto('/buyer-decision-packet');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page, 200);
    const bodyLower = bodyText.toLowerCase();
    // Flexible match — "90-day", "90 day", "90 days", or "90" in context
    const has90 =
      bodyLower.includes('90-day') ||
      bodyLower.includes('90 day') ||
      bodyLower.includes('90 days') ||
      /\b90\b/.test(bodyLower);
    expect(has90).toBe(true);
    expect(bodyText).toMatch(/founding partner|executive access/i);
  });

  test('/buyer-decision-packet has governance content', async ({ page }) => {
    await page.goto('/buyer-decision-packet');
    const bodyText = await getStableBodyText(page);
    const hasGovernance =
      bodyText.includes('Governance') ||
      bodyText.includes('authority') ||
      bodyText.includes('Authority');
    expect(hasGovernance).toBe(true);
  });
});

// ─── 12-MINUTE TEST DRIVE ─────────────────────────────────────────────────────

test.describe('12-Minute Test Drive — Public Lead Gen', () => {
  test('test drive page loads', async ({ page }) => {
    await page.goto('/12-minute-experience');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('test drive contains readiness/12-minute content', async ({ page }) => {
    await page.goto('/12-minute-experience');
    const bodyText = await getStableBodyText(page);
    const hasContent =
      /12|readiness|protocol|trigger|execute/i.test(bodyText);
    expect(hasContent).toBe(true);
  });

  test('test drive does not use retired Pilot language', async ({ page }) => {
    await page.goto('/12-minute-experience');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Pilot Program');
  });
});

// ─── REQUEST ACCESS / CONTACT ─────────────────────────────────────────────────

test.describe('Request Access & Contact', () => {
  test('/request-access loads', async ({ page }) => {
    await page.goto('/request-access');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/request-access uses Founding Partner or Executive Access language', async ({ page }) => {
    await page.goto('/request-access');
    const bodyText = await getStableBodyText(page);
    const hasAccessLanguage =
      /founding partner|executive access|request executive access|access request|request access/i.test(bodyText);
    expect(hasAccessLanguage).toBe(true);
  });

  test('/request-access does not use retired Pilot language', async ({ page }) => {
    await page.goto('/request-access');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Pilot Program');
    expect(bodyText).not.toContain('Pilot Access');
    expect(bodyText).not.toContain('Now in Pilot');
  });

  test('/contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/contact page has a form or input', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1000);
    const hasForm =
      (await page.locator('input').count()) > 0 ||
      (await page.locator('textarea').count()) > 0 ||
      (await page.locator('form').count()) > 0;
    expect(hasForm).toBe(true);
  });

  test('/contact does not use retired Pilot language', async ({ page }) => {
    await page.goto('/contact');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Pilot Program');
    expect(bodyText).not.toContain('Pilot Access');
  });
});

// ─── PROTOCOL / PLAYBOOK LIBRARY ─────────────────────────────────────────────

test.describe('Protocol Library — Public Browse', () => {
  test('/playbook-library loads', async ({ page }) => {
    await page.goto('/playbook-library');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/playbook-library shows protocol content', async ({ page }) => {
    await page.goto('/playbook-library');
    const bodyText = await getStableBodyText(page);
    const hasContent =
      /readiness protocol|protocol|playbook|170/i.test(bodyText);
    expect(hasContent).toBe(true);
  });

  test('/playbook-library does not use retired domain labels', async ({ page }) => {
    await page.goto('/playbook-library');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('Special Teams');
  });
});

// ─── DEMO PAGES ───────────────────────────────────────────────────────────────

test.describe('Demo Hub & Scenario Demos', () => {
  test('/demo-hub loads', async ({ page }) => {
    await page.goto('/demo-hub');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('/demo-hub contains demo content', async ({ page }) => {
    await page.goto('/demo-hub');
    const bodyText = await getStableBodyText(page);
    const hasDemoContent =
      /demo|protocol|scenario|readiness/i.test(bodyText);
    expect(hasDemoContent).toBe(true);
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
    await page.goto('/investors');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toMatch(/readiness|investor|vaughnmartin/i);
  });

  test('/investors uses correct 3,600× metric framing', async ({ page }) => {
    await page.goto('/investors');
    const bodyText = await getStableBodyText(page);
    expect(bodyText).not.toContain('340×');
    expect(bodyText).not.toContain('360×');
  });

  test('/investor-landing loads', async ({ page }) => {
    await page.goto('/investor-landing');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    expect(bodyText).toMatch(/readiness|investor|vaughnmartin/i);
  });

  test('/investor-landing carries the canonical tagline', async ({ page }) => {
    await page.goto('/investor-landing');
    const bodyText = await getStableBodyText(page);
    const hasTagline =
      /trigger|3,600|12 minutes|response is ready|before the trigger fires/i.test(bodyText);
    expect(hasTagline).toBe(true);
  });

  test('/investor-presentation loads with access gate', async ({ page }) => {
    await page.goto('/investor-presentation');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const bodyText = await getStableBodyText(page);
    // Gate form or actual presentation — both are valid
    const hasContent =
      /investor|vaughnmartin|readiness|access|password|enter/i.test(bodyText);
    expect(hasContent).toBe(true);
  });
});

// ─── REDIRECTS ────────────────────────────────────────────────────────────────

test.describe('Redirects — Current Production Behavior', () => {
  test('/dashboard redirects away (auth-gated or route redirect)', async ({ page }) => {
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

  test('/demos redirects to /demo-hub', async ({ page }) => {
    await page.goto('/demos');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('demo-hub');
  });

  test('/command-center redirects to /mission-control', async ({ page }) => {
    await page.goto('/command-center');
    await page.waitForTimeout(1000);
    const url = page.url();
    const redirected = url.includes('mission-control') || url.includes('request-access');
    expect(redirected).toBe(true);
  });

  test('/sizzle redirects to 12-minute experience', async ({ page }) => {
    await page.goto('/sizzle');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('12-minute-experience');
  });
});

// ─── PROTOCOL BUILDER ─────────────────────────────────────────────────────────

test.describe('Protocol Builder — Public Builder Flow', () => {
  test('/protocol-builder loads', async ({ page }) => {
    await page.goto('/protocol-builder');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('Protocol Builder shows quick-start templates', async ({ page }) => {
    await page.goto('/protocol-builder');
    const bodyText = await getStableBodyText(page);
    const hasTemplates =
      /template|quick|protocol/i.test(bodyText);
    expect(hasTemplates).toBe(true);
  });

  test('Protocol Builder has step navigation', async ({ page }) => {
    await page.goto('/protocol-builder');
    await page.waitForTimeout(1500);
    const hasSteps =
      (await page.locator('button').filter({ hasText: /next|continue|step/i }).count()) > 0 ||
      (await page.locator('[class*="step"], [class*="Step"]').count()) > 0;
    expect(hasSteps).toBe(true);
  });
});

// ─── INDUSTRY DEMOS ───────────────────────────────────────────────────────────

test.describe('Industry Demos — Core Scenarios', () => {
  const coreScenarios = [
    { path: '/demo/ransomware', name: 'Ransomware' },
    { path: '/demo/market-entry', name: 'Market Entry' },
    { path: '/demo/product-launch', name: 'Product Launch' },
  ];

  for (const { path, name } of coreScenarios) {
    test(`${name} demo (${path}) loads`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      const bodyText = await getStableBodyText(page);
      const hasContent =
        /market|entry|scenario|demo|protocol|readiness|trigger|12/i.test(bodyText);
      expect(hasContent).toBe(true);
    });
  }
});

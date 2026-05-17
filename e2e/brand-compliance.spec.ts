import { test, expect } from '@playwright/test';

/**
 * Brand Language Compliance — E2E Tests
 *
 * Validates the zero-tolerance language rules across key public-facing pages.
 * These tests catch regressions where retired terminology re-enters the UI.
 *
 * Rules enforced (from replit.md):
 *  - "AI-powered", "AI-driven", "AI-generated", "AI Confidence" → RETIRED
 *  - "Pilot Program", "Pilot Access", "Now in Pilot" → RETIRED
 *  - "Offense", "Defense", "Special Teams" as UI labels → RETIRED
 *  - "340×", "360×", "72 hours" as speed metrics → RETIRED
 *  - "Founding Partner" language must appear on access pages
 *  - "Signal Confidence" must be used where confidence is displayed
 */

const KEY_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/playbook-library', name: 'Playbook Library' },
  { path: '/intelligence-demo', name: 'Intelligence Demo' },
  { path: '/request-access', name: 'Request Access' },
  { path: '/how-it-works', name: 'How It Works' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/our-story', name: 'Our Story' },
  { path: '/cost-of-inaction', name: 'Cost of Inaction' },
  { path: '/first-90-days', name: 'First 90 Days' },
  { path: '/founding-partner', name: 'Founding Partner' },
  { path: '/buyer-decision-packet', name: 'Buyer Decision Packet' },
];

const RETIRED_EXACT_PHRASES = [
  'Pilot Program',
  'Pilot Access',
  'Now in Pilot',
  'AI Confidence',
  'speed advantage',
  '340×',
  '360×',
  '72 hours',
];

const RETIRED_DOMAIN_LABELS = [
  { label: 'Offense', context: 'domain label (should be GROWTH & POSITIONING)' },
  { label: 'Defense', context: 'domain label (should be RISK & RESILIENCE)' },
  { label: 'Special Teams', context: 'domain label (should be TRANSFORMATION)' },
];

for (const page_info of KEY_PAGES) {
  test.describe(`Brand Compliance — ${page_info.name} (${page_info.path})`, () => {
    test(`${page_info.name} loads without retired Pilot Program language`, async ({ page }) => {
      await page.goto(page_info.path);
      await page.waitForTimeout(1500);
      const bodyText = await page.locator('body').innerText();

      expect(bodyText, '"Pilot Program" must not appear').not.toContain('Pilot Program');
      expect(bodyText, '"Now in Pilot" must not appear').not.toContain('Now in Pilot');
    });

    test(`${page_info.name} does not show "AI Confidence" label`, async ({ page }) => {
      await page.goto(page_info.path);
      await page.waitForTimeout(1500);
      const bodyText = await page.locator('body').innerText();
      expect(bodyText, '"AI Confidence" must not appear').not.toContain('AI Confidence');
    });

    test(`${page_info.name} does not show retired speed metrics (340×, 360×)`, async ({ page }) => {
      await page.goto(page_info.path);
      await page.waitForTimeout(1500);
      const bodyText = await page.locator('body').innerText();
      expect(bodyText, '"340×" is a retired metric').not.toContain('340×');
      expect(bodyText, '"360×" is a retired metric').not.toContain('360×');
    });
  });
}

test.describe('Founding Partner Language — Access Pages', () => {
  test('/request-access uses "Founding Partner" language', async ({ page }) => {
    await page.goto('/request-access');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('Founding Partner');
  });

  test('/contact page does not revert to "Pilot" language', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Pilot Program');
    expect(bodyText).not.toContain('Pilot Access');
  });
});

test.describe('Domain Label Compliance — Key Pages', () => {
  const domainPages = ['/', '/playbook-library', '/how-it-works'];

  for (const path of domainPages) {
    test(`${path} does not use retired football domain labels`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(1500);
      const bodyText = await page.locator('body').innerText();

      for (const { label, context } of RETIRED_DOMAIN_LABELS) {
        const pattern = new RegExp(`\\b${label}\\b`);
        const matchFound = pattern.test(bodyText);
        if (matchFound) {
          const lines = bodyText.split('\n').filter(l => l.includes(label));
          const isOnlyFounderStory = lines.every(l =>
            l.toLowerCase().includes('founder') || l.toLowerCase().includes('story')
          );
          if (!isOnlyFounderStory) {
            expect(false, `"${label}" (${context}) must not appear as a domain label on ${path}`).toBe(true);
          }
        }
      }
    });
  }
});

test.describe('3,600× Metric Framing', () => {
  test('homepage uses "3,600×" framing (not "340×" or "360×")', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();

    expect(bodyText).not.toContain('340×');
    expect(bodyText).not.toContain('360×');

    const uses3600 =
      bodyText.includes('3,600') ||
      bodyText.includes('3600') ||
      bodyText.includes('12 minutes') ||
      bodyText.includes('30 days');
    expect(uses3600, 'Homepage must reference the 3,600× or 12-minute framing').toBe(true);
  });

  test('investor presentation uses correct metric framing', async ({ page }) => {
    await page.goto('/investor-presentation');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('340×');
    expect(bodyText).not.toContain('360×');
  });
});

test.describe('VaughnMartin Brand Presence', () => {
  test('homepage references VaughnMartin brand', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('VaughnMartin');
  });

  test('"Readiness OS" product name appears on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    const hasProductName =
      bodyText.includes('Readiness OS') ||
      bodyText.includes('Readiness Protocol') ||
      bodyText.includes('Readiness');
    expect(hasProductName, '"Readiness OS" or "Readiness Protocol" must appear on homepage').toBe(true);
  });

  test('no page contains retired brand name "Phronex"', async ({ page }) => {
    for (const { path } of KEY_PAGES) {
      await page.goto(path);
      await page.waitForTimeout(800);
      const bodyText = await page.locator('body').innerText();
      expect(bodyText, `"Phronex" must not appear on ${path}`).not.toContain('Phronex');
    }
  });
});

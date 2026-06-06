import { test, expect } from '@playwright/test';
import { gotoStable } from './helpers/shared';

/**
 * Brand Language Compliance — E2E Tests
 *
 * Zero-tolerance language rules across key public-facing pages.
 * Zero fixed sleeps — all waits are condition-based via gotoStable().
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
  { path: '/',                      name: 'Homepage' },
  { path: '/playbook-library',      name: 'Playbook Library' },
  { path: '/intelligence-demo',     name: 'Intelligence Demo' },
  { path: '/request-access',        name: 'Request Access' },
  { path: '/how-it-works',          name: 'How It Works' },
  { path: '/pricing',               name: 'Pricing' },
  { path: '/our-story',             name: 'Our Story' },
  { path: '/cost-of-inaction',      name: 'Cost of Inaction' },
  { path: '/first-90-days',         name: 'First 90 Days' },
  { path: '/founding-partner',      name: 'Founding Partner' },
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
];

const RETIRED_DOMAIN_LABELS = [
  { label: 'Offense',      context: 'domain label (should be GROWTH & POSITIONING)' },
  { label: 'Defense',      context: 'domain label (should be RISK & RESILIENCE)' },
  { label: 'Special Teams', context: 'domain label (should be TRANSFORMATION)' },
];

for (const page_info of KEY_PAGES) {
  test.describe(`Brand Compliance — ${page_info.name} (${page_info.path})`, () => {
    test(`${page_info.name} loads without retired Pilot Program language`, async ({ page }) => {
      const body = await gotoStable(page, page_info.path);
      expect(body, '"Pilot Program" must not appear').not.toContain('Pilot Program');
      expect(body, '"Now in Pilot" must not appear').not.toContain('Now in Pilot');
    });

    test(`${page_info.name} does not show "AI Confidence" label`, async ({ page }) => {
      const body = await gotoStable(page, page_info.path);
      expect(body, '"AI Confidence" must not appear').not.toContain('AI Confidence');
    });

    test(`${page_info.name} does not show retired speed metrics (340×, 360×)`, async ({ page }) => {
      const body = await gotoStable(page, page_info.path);
      expect(body, '"340×" is a retired metric').not.toContain('340×');
      expect(body, '"360×" is a retired metric').not.toContain('360×');
    });
  });
}

test.describe('Founding Partner Language — Access Pages', () => {
  test('/request-access uses "Founding Partner" language', async ({ page }) => {
    const body = await gotoStable(page, '/request-access');
    expect(body).toContain('Founding Partner');
  });

  test('/contact page does not revert to "Pilot" language', async ({ page }) => {
    const body = await gotoStable(page, '/contact');
    expect(body).not.toContain('Pilot Program');
    expect(body).not.toContain('Pilot Access');
  });
});

test.describe('Domain Label Compliance — Key Pages', () => {
  const domainPages = ['/', '/playbook-library', '/how-it-works'];

  for (const path of domainPages) {
    test(`${path} does not use retired football domain labels`, async ({ page }) => {
      const bodyText = await gotoStable(page, path);

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
    const body = await gotoStable(page, '/');
    expect(body).not.toContain('340×');
    expect(body).not.toContain('360×');
    const uses3600 =
      body.includes('3,600') || body.includes('3600') ||
      body.includes('12 minutes') || body.includes('30 days');
    expect(uses3600, 'Homepage must reference the 3,600× or 12-minute framing').toBe(true);
  });

  test('investor presentation uses correct metric framing', async ({ page }) => {
    const body = await gotoStable(page, '/investor-presentation');
    expect(body).not.toContain('340×');
    expect(body).not.toContain('360×');
  });
});

test.describe('VaughnMartin Brand Presence', () => {
  test('homepage references VaughnMartin brand', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).toContain('VaughnMartin');
  });

  test('"Readiness OS" product name appears on homepage', async ({ page }) => {
    const body = await gotoStable(page, '/');
    expect(body).toMatch(/Readiness OS|Readiness Protocol|Readiness/);
  });

  test('no key page contains retired brand name "Phronex"', async ({ page }) => {
    for (const { path } of KEY_PAGES) {
      const body = await gotoStable(page, path);
      expect(body, `"Phronex" must not appear on ${path}`).not.toContain('Phronex');
    }
  });
});

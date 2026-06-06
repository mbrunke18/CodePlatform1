import { type Page } from '@playwright/test';

export const PUBLIC_ROUTES = [
  '/how-it-works',
  '/how-it-executes',
  '/pricing',
  '/contact',
  '/proof-story',
  '/roi-calculator',
  '/executive-brief',
  '/security-compliance',
  '/request-access',
  '/founding-partner',
  '/12-minute-experience',
  '/playbook-library',
  '/demo-hub',
  '/master-demo',
  '/investors',
  '/investor-landing',
  '/the-proof',
  '/design-logic',
  '/executive-brief',
  '/cost-of-inaction',
  '/first-90-days',
  '/board-memo',
  '/buyer-decision-packet',
  '/protocol-builder',
];

export const REDIRECT_PAIRS: Array<{ from: string; toPattern: RegExp }> = [
  { from: '/demos',          toPattern: /demo-hub/ },
  { from: '/sizzle',         toPattern: /12-minute-experience/ },
  { from: '/command-center', toPattern: /mission-control|request-access/ },
  { from: '/dashboard',      toPattern: /request-access|playbooks|mission-control/ },
  { from: '/scenarios',      toPattern: /playbooks|request-access/ },
];

/**
 * Navigates to a path and waits for load + network idle.
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('load');
}

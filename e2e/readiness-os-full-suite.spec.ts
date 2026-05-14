import { test, expect, type Page, type APIResponse } from '@playwright/test';

type PublicPageExpectation = {
  path: string;
  expectedText: RegExp;
};

const CORE_PUBLIC_PAGES: PublicPageExpectation[] = [
  { path: '/', expectedText: /The Response Is Ready|Before the Trigger Fires/i },
  { path: '/how-it-executes', expectedText: /12-Minute Execution Chain/i },
  { path: '/how-it-works', expectedText: /How 12 Minutes Actually Happens/i },
  { path: '/playbook-library', expectedText: /Readiness Protocol|Founding Partner access required/i },
  { path: '/request-access', expectedText: /Request Executive Access/i },
  { path: '/founding-partner-program', expectedText: /Founding Partner Program/i },
  { path: '/12-minute-experience', expectedText: /12-Minute Test Drive|Choose Your Strategic Scenario/i },
  { path: '/growth', expectedText: /Ready|Responsive|Orchestrated/i },
  { path: '/investor-landing', expectedText: /Operating Model Layer|Schedule a Conversation/i },
  { path: '/industry-demos', expectedText: /industry|scenario|demo/i },
];

async function expectPageLoads(page: Page, path: string, expectedText: RegExp) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('body')).toContainText(expectedText, { timeout: 20000 });
}

async function expectResponseHasBody(response: APIResponse) {
  expect(response.ok(), `Expected ${response.url()} to be successful`).toBeTruthy();
  const body = await response.text();
  expect(body.length).toBeGreaterThan(0);
}

test.describe('Readiness OS - Replit Full End-to-End Suite', () => {
  test('health and uptime endpoints respond successfully', async ({ request }) => {
    const endpoints = ['/health', '/_health', '/api/health', '/api/health-check'];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      await expectResponseHasBody(response);
    }
  });

  test('core public product pages render with expected outcomes', async ({ page }) => {
    for (const pageDef of CORE_PUBLIC_PAGES) {
      await expectPageLoads(page, pageDef.path, pageDef.expectedText);
    }
  });

  test('route aliases and redirects resolve correctly', async ({ page }) => {
    await page.goto('/home');
    await expect(page.locator('body')).toContainText(/The Response Is Ready|Before the Trigger Fires/i);

    await page.goto('/command-center');
    await expect(page).toHaveURL(/\/mission-control/);

    await page.goto('/pilot-program');
    await expect(page.locator('[data-testid="heading-pilot-program"]')).toBeVisible();
  });

  test('playbook library enforces guest gating and request-access path', async ({ page }) => {
    await page.goto('/playbook-library');

    await expect(page.locator('body')).toContainText(/3 Full Readiness Protocol Previews/i);
    await expect(page.locator('body')).toContainText(/Founding Partner access required/i);

    const requestAccessButton = page
      .locator('button')
      .filter({ hasText: /^Request Access$/i })
      .first();

    await expect(requestAccessButton).toBeVisible();
    await requestAccessButton.click();
    await expect(page).toHaveURL(/\/(request-access|founding-partner-program)/);
  });

  test('founding partner conversion CTA opens request-access flow', async ({ page }) => {
    await page.goto('/founding-partner-program');
    await expect(page.locator('[data-testid="heading-pilot-program"]')).toBeVisible();

    const applyButton = page.locator('[data-testid="button-apply-pilot"]');
    await expect(applyButton).toBeVisible();
    await applyButton.click();

    await expect(page).toHaveURL(/\/(founding-partner-program|request-access)/);
    await expect(page.locator('body')).toContainText(/Founding Partner Program|Request Executive Access/i);
  });

  test('request-access form validates, submits, and shows success state', async ({ page }) => {
    await page.route('**/api/auth/magic-link/request', async (route) => {
      const body = route.request().postDataJSON() as Record<string, string>;

      expect(body.firstName).toBeTruthy();
      expect(body.lastName).toBeTruthy();
      expect(body.email).toContain('@');
      expect(body.company).toBeTruthy();
      expect(body.title).toBeTruthy();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, emailSent: true }),
      });
    });

    await page.goto('/request-access');
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('Tester');
    await page.locator('input[name="email"]').fill('tester@example.com');
    await page.locator('input[name="company"]').fill('VaughnMartin QA');
    await page.locator('input[name="title"]').fill('VP Strategy');

    await page.getByRole('button', { name: /Send My Access Link/i }).click();

    await expect(page.locator('body')).toContainText(/Your link is on its way/i);
    await expect(page.locator('body')).toContainText(/tester@example\.com/i);
  });

  test('12-minute experience scenario flow advances into active war room', async ({ page }) => {
    await page.route('**/api/simulation/public-analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          aiAnalysis: 'System analysis complete. Pre-staged response available.',
          urgencyLevel: 'high',
          activatedPlaybooks: ['Ransomware Response Protocol'],
        }),
      });
    });

    await page.goto('/12-minute-experience');

    await page.getByRole('button', { name: /Ransomware Attack/i }).first().click();
    await page.getByRole('button', { name: /Begin Test Drive/i }).click();

    await expect(page.locator('body')).toContainText(/Signal-Based Execution Brief/i);
    const executeButton = page
      .getByRole('button', { name: /Authorize Execution|Enter the War Room/i })
      .first();
    await executeButton.click();

    const runAsBuiltButton = page.getByRole('button', { name: /Run as Built/i }).first();
    if (await runAsBuiltButton.isVisible()) {
      await runAsBuiltButton.click();
    }

    const confirmRunAsBuiltButton = page
      .getByRole('button', { name: /Confirm.*Run as Built/i })
      .first();
    if (await confirmRunAsBuiltButton.isVisible()) {
      await confirmRunAsBuiltButton.click();
    }

    await expect(page.locator('body')).toContainText(/War Room Active|LIVE|12-minute execution clock started|War room secured/i);
    await expect(page.locator('body')).toContainText(/12-minute execution clock started|War room secured/i);

    // First task dispatches at 1:00 simulated time (~7.2s real time)
    await page.waitForTimeout(8500);
    await expect(page.locator('body')).toContainText(/NOTIFIED|ACK ✓/i);
  });

  test('public API surface responds for core demo endpoints', async ({ request }) => {
    const endpoints: Record<string, number[]> = {
      '/api/public/live-context': [200],
      '/api/playbook-library': [200],
      '/api/playbook-library/domains': [200],
      '/api/dashboard/metrics': [200, 401],
      '/api/readiness-score': [200, 401],
    };

    for (const [endpoint, allowedStatuses] of Object.entries(endpoints)) {
      const response = await request.get(endpoint);
      expect(
        allowedStatuses.includes(response.status()),
        `Expected ${endpoint} status to be one of [${allowedStatuses.join(', ')}], got ${response.status()}`
      ).toBeTruthy();

      const body = await response.text();
      expect(body.length).toBeGreaterThan(0);
    }
  });

  test('homepage static metadata includes required baseline tags', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    expect(html).toContain('<title>');
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:title"');
  });
});

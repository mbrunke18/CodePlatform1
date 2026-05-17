import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const isProduction = BASE_URL.includes('vaughnmartin.com') || BASE_URL.includes('https://');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Only start the local dev server when not running against production */
  ...(isProduction
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: 'http://localhost:5000',
          reuseExistingServer: !process.env.CI,
        },
      }),
});

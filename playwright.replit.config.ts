import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5000';
const useExistingServer = !!process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  testMatch: 'readiness-os-full-suite.spec.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/replit-full-suite', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: useExistingServer
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180000,
      },
});

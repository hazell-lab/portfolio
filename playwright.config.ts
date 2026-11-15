// end to end tests against the production build, served by astro preview.
// they run in microsoft edge or google chrome if one is installed (set PW_CHANNEL),
// otherwise in the chromium that `npx playwright install chromium` downloads.
import { defineConfig, devices } from '@playwright/test';

const port = 4322;
const channel = process.env['PW_CHANNEL'] || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...(channel && { channel }) } },
    { name: 'mobile', use: { ...devices['Pixel 7'], ...(channel && { channel }) } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --host localhost`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});

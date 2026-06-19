import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

/**
 * Remote E2E config — runs tests against a deployed environment.
 *
 * Use to capture baselines from the Material (main) deployment,
 * then compare against the Spartan (local) build.
 *
 * Workflow for visual regression:
 *   1. Capture Material baselines from Azure:
 *      BASE_URL=https://angularclinetcorengrxstarter.azurewebsites.net pnpm e2e:remote --update-snapshots
 *
 *   2. Run same tests against local Spartan build to compare:
 *      pnpm e2e
 *
 *   3. Or capture Spartan baselines from a preview deployment:
 *      BASE_URL=<preview-url> pnpm e2e:remote
 *
 *   4. Compare the two screenshot directories manually:
 *      diff apps/web-app-e2e/screenshots-material/ apps/web-app-e2e/src/__screenshots__/
 */
const baseURL =
  (process.env['BASE_URL'] as string | undefined) ||
  'https://angularclinetcorengrxstarter.azurewebsites.net';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),

  use: {
    baseURL,
    trace: 'on-first-retry',
    // Screenshots from the remote Material deployment go to a separate dir
    // so they don't clash with local Spartan baselines.
    screenshot: 'only-on-failure',
  },

  // Remote testing: no local dev servers to spin up.
  // Override the webServer to be empty (the preset may set one).
  webServer: [],

  // Store Material baselines in a separate directory so they survive
  // branch switches and don't conflict with local Spartan baselines.
  snapshotDir: './screenshots-material',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

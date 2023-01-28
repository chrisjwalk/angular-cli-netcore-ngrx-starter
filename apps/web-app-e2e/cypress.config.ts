import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

import setupNodeEvents from './src/plugins/index';

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../dist/cypress/apps/web-app-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-app-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename),
    ...cypressJsonConfig,
    setupNodeEvents,
    /**
    * TODO(@nrwl/cypress): In Cypress v12,the testIsolation option is turned on by default. 
    * This can cause tests to start breaking where not indended.
    * You should consider enabling this once you verify tests do not depend on each other
    * More Info: https://docs.cypress.io/guides/references/migration-guide#Test-Isolation
    **/
    testIsolation: false,
 },
});

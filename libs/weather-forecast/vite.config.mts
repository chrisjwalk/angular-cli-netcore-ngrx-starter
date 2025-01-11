/// <reference types='vitest' />

import angular from '@analogjs/vite-plugin-angular';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: `../../junit/libs/weather-forecast/TESTS-${Date.now()}.xml`,
    },
    coverage: {
      reportsDirectory: '../../coverage/libs/weather-forecast',
      reporter: ['text', 'cobertura'],
      provider: 'v8',
    },
    server: {
      deps: {
        inline: ['@angular/material'],
      },
    },
  },
});

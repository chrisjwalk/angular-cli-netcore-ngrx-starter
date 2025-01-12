/// <reference types='vitest' />

import angular from '@analogjs/vite-plugin-angular';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export const baseConfig = {
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default', 'junit'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'cobertura'],
    },
    server: {
      deps: {
        inline: ['@angular/material'],
      },
    },
  },
};

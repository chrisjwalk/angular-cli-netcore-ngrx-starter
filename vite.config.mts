/// <reference types='vitest' />

import angular from '@analogjs/vite-plugin-angular';
import { Plugin } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

function virtualPwaRegisterStub(): Plugin {
  return {
    name: 'virtual-pwa-register-stub',
    resolveId(id) {
      if (id === 'virtual:pwa-register') return '\0virtual:pwa-register';
    },
    load(id) {
      if (id === '\0virtual:pwa-register')
        return `export function registerSW() { return async () => {}; }`;
    },
  };
}

export const baseConfig = {
  root: __dirname,
  plugins: [angular(), nxViteTsPaths(), virtualPwaRegisterStub()],
  test: {
    watch: false,
    globals: true,
    isolate: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default', 'junit'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'cobertura'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.routes.ts',
        'src/**/*.config.ts',
        'src/main.ts',
        'src/environments/**',
      ],
      thresholds: {
        perFile: true,
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    server: {
      deps: {
        inline: ['@angular/material'],
      },
    },
  },
};

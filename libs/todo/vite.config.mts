/// <reference types='vite-plus/test' />
import { defineConfig, UserConfig } from 'vite';

import { baseConfig } from '../../vite.base.config.mjs';

export default defineConfig({
  ...baseConfig,
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/todo',
  plugins: [...(baseConfig.plugins ?? [])],
  test: {
    ...(baseConfig.test as UserConfig['test']),
    name: 'todo',
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      reportsDirectory: '../../coverage/libs/todo',
      provider: 'v8' as const,
    },
  },
});

/// <reference types='vitest' />
import { defineConfig, UserConfig } from 'vite';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

import { baseConfig } from '../../vite.config.mjs';

export default defineConfig({
  ...baseConfig,
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/todo',
  plugins: [
    ...(baseConfig.plugins ?? []),
    nxCopyAssetsPlugin(['*.md']),
  ],
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

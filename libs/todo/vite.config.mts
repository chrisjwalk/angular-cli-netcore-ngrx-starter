/// <reference types='vitest' />
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig, Plugin, UserConfig } from 'vite';

import { baseConfig } from '../../vite.config.mjs';

// Replaces the removed nxCopyAssetsPlugin(['*.md']): emits top-level markdown
// files from this project's root into the build output root.
function copyMdAssets(): Plugin {
  return {
    name: 'copy-md-assets',
    apply: 'build',
    async generateBundle() {
      for (const entry of await readdir(import.meta.dirname)) {
        if (entry.endsWith('.md')) {
          const source = await readFile(join(import.meta.dirname, entry));
          this.emitFile({ type: 'asset', fileName: entry, source });
        }
      }
    },
  };
}

export default defineConfig({
  ...baseConfig,
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/todo',
  plugins: [...(baseConfig.plugins ?? []), copyMdAssets()],
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

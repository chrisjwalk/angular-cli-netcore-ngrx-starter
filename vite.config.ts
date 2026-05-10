import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    trailingComma: 'all',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    importOrderParserPlugins: ['typescript', 'decorators-legacy'],
    importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [
      '/dist',
      '/coverage',
      '/.nx/cache',
      '/.nx/workspace-data',
      '.angular',
    ],
  },
  run: {
    tasks: {
      build: {
        command: 'vp run -r build',
        cache: false,
      },
      test: {
        command: 'vp run -r test',
        cache: false,
      },
    },
  },
});

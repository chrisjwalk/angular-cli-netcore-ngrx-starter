import path from 'path';

import analog from '@analogjs/platform';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, lazyPlugins } from 'vite-plus';

// The root config drives `vp build` / `vp dev` for the Angular app in apps/web-app.
// Workspace tooling (fmt, lint, test, run) is layered on top.
// lazyPlugins defers plugin instantiation so `vp fmt`/`vp check` don't load
// Angular-specific plugins that expect tsconfigs relative to the app root.
const workspaceRoot = import.meta.dirname;
const webAppRoot = path.resolve(workspaceRoot, 'apps/web-app');

export default defineConfig({
  root: webAppRoot,
  cacheDir: path.resolve(workspaceRoot, 'node_modules/.vite'),
  build: {
    outDir: path.resolve(workspaceRoot, 'dist/apps/web-app/client'),
    reportCompressedSize: true,
    target: ['es2020'],
  },
  optimizeDeps: {
    include: ['front-matter'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: lazyPlugins(() => [
    analog({
      ssr: false,
      static: true,
      apiPrefix: '_analog',
      prerender: { routes: [] },
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlighter: {
            additionalLangs: ['bash', 'shell', 'yaml', 'mermaid'],
            skipLangs: ['mermaid'],
          },
        },
      },
    }),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      devOptions: { enabled: false },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
      manifest: {
        name: 'Angular Cli Netcore NgRx Starter',
        short_name: 'Demo App',
        theme_color: '#fafafa',
        background_color: '#fafafa',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'en-US',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'assets/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'assets/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ]),
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:60253',
        secure: false,
      },
    },
    fs: {
      allow: [workspaceRoot],
    },
  },

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
    ignorePatterns: ['/dist', '/coverage', '.angular'],
  },
  lint: {
    options: {
      typeAware: false,
    },
  },
  test: {
    projects: [
      `${workspaceRoot}/libs/*/vite.config.mts`,
      `${workspaceRoot}/apps/web-app/vite.config.ts`,
      `${workspaceRoot}/tools/update-packages/vite.config.mts`,
    ],
  },
  run: {
    tasks: {
      build: {
        command: 'vp run -r build',
        cache: false,
      },
      dev: {
        command: 'vp dev',
        cache: false,
      },
      test: {
        command: 'vp run -r test',
        cache: false,
      },
    },
  },
});

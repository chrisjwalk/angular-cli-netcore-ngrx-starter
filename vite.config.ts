import path from 'path';

import analog from '@analogjs/platform';
import { federation } from '@module-federation/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, lazyPlugins } from 'vite-plus';

// The root config drives `vp build` / `vp dev` for the Angular app in apps/web-app.
// Workspace tooling (fmt, lint, test, run) is layered on top.
// lazyPlugins defers plugin instantiation so `vp fmt`/`vp check` don't load
// Angular-specific plugins that expect tsconfigs relative to the app root.
const workspaceRoot = import.meta.dirname;
const webAppRoot = path.resolve(workspaceRoot, 'apps/web-app');

const angVer = '~22.0.0';
const cdkMatVer = '~22.0.0';

const mfeSharedDeps = {
  '@angular/animations': { singleton: true, requiredVersion: angVer },
  '@angular/common': { singleton: true, requiredVersion: angVer },
  '@angular/common/http': { singleton: true, requiredVersion: angVer },
  '@angular/compiler': { singleton: true, requiredVersion: angVer },
  '@angular/core': { singleton: true, requiredVersion: angVer },
  '@angular/forms': { singleton: true, requiredVersion: angVer },
  '@angular/platform-browser': { singleton: true, requiredVersion: angVer },
  '@angular/platform-browser/animations': {
    singleton: true,
    requiredVersion: angVer,
  },
  '@angular/platform-browser-dynamic': {
    singleton: true,
    requiredVersion: angVer,
  },
  '@angular/router': { singleton: true, requiredVersion: angVer },
  '@angular/cdk/a11y': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/bidi': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/layout': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/observers': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/overlay': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/portal': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/scrolling': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/text-field': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/badge': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/bottom-sheet': {
    singleton: true,
    requiredVersion: cdkMatVer,
  },
  '@angular/material/button': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/checkbox': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/core': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/form-field': {
    singleton: true,
    requiredVersion: cdkMatVer,
  },
  '@angular/material/divider': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/icon': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/input': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/list': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/paginator': {
    singleton: true,
    requiredVersion: cdkMatVer,
  },
  '@angular/material/progress-spinner': {
    singleton: true,
    requiredVersion: cdkMatVer,
  },
  '@angular/material/sidenav': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/snack-bar': {
    singleton: true,
    requiredVersion: cdkMatVer,
  },
  '@angular/material/table': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/toolbar': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/tooltip': { singleton: true, requiredVersion: cdkMatVer },
  '@ngrx/signals': { singleton: true, requiredVersion: '~21.1.0' },
  rxjs: { singleton: true, requiredVersion: '~7.8.2' },
  tslib: { singleton: true, requiredVersion: '~2.8.1' },
};

// When STUB_MFE_REMOTES is set (E2E, CI) or in test mode, redirect
// federation virtual modules to local stubs so the host can load without
// the counter-remote dev server running.
const stubMfeRemotes = process.env['STUB_MFE_REMOTES'];

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
    alias: stubMfeRemotes
      ? {
          'counter-remote/Routes': path.resolve(
            webAppRoot,
            'src/test-stubs/counter-remote-routes.ts',
          ),
        }
      : {},
  },
  plugins: lazyPlugins(() => [
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      dts: false,
      remotes: {
        'counter-remote': {
          type: 'module',
          name: 'counter-remote',
          entry:
            process.env['COUNTER_REMOTE_ENTRY'] ??
            'http://localhost:4201/remoteEntry.js',
          entryGlobalName: 'counter-remote',
          shareScope: 'default',
        },
      },
      exposes: {},
      shared: mfeSharedDeps,
    }),
    analog({
      ssr: false,
      static: true,
      apiPrefix: '_analog',
      prerender: { routes: [] },
      // In test mode, use fast-compile so Angular components loaded via
      // MFE stubs are compiled with the local single-pass AOT compiler.
      fastCompile: !!stubMfeRemotes,
      fileReplacements:
        process.env['NX_TASK_TARGET_CONFIGURATION'] === 'preview'
          ? [
              {
                replace: 'apps/web-app/src/environments/environment.ts',
                with: 'apps/web-app/src/environments/environment.preview.ts',
              },
            ]
          : [],
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
      `${workspaceRoot}/apps/api/Api.Test/vitest.config.ts`,
      `${workspaceRoot}/tools/update-packages/vite.config.mts`,
    ],
  },
  staged: {
    '*': 'vp check --fix',
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

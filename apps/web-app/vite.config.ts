/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { federation } from '@module-federation/vite';
import { VitePWA } from 'vite-plugin-pwa';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const angVer = '~21.2.15';
const cdkMatVer = '~21.2.13';

const mfeSharedDeps = {
  // Angular core
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
  // Angular CDK sub-paths
  '@angular/cdk/a11y': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/layout': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/overlay': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/portal': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/scrolling': { singleton: true, requiredVersion: cdkMatVer },
  // Angular Material sub-paths
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
  '@angular/material/snack-bar': {
    singleton: true,
    requiredVersion: cdkMatVer,
  },
  '@angular/material/table': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/toolbar': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/material/tooltip': { singleton: true, requiredVersion: cdkMatVer },
  // NgRx
  '@ngrx/signals': { singleton: true, requiredVersion: '~21.1.0' },
  '@ngrx/signals/events': { singleton: true, requiredVersion: '~21.1.0' },
  // Workspace libs
  '@myorg/counter': { singleton: true, requiredVersion: false },
  '@myorg/shared': { singleton: true, requiredVersion: false },
  // Utilities
  rxjs: { singleton: true, requiredVersion: '~7.8.2' },
  tslib: { singleton: true, requiredVersion: '~2.8.1' },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite',
    build: {
      outDir: '../../dist/apps/web-app/client',
      reportCompressedSize: true,
      target: ['chrome89'],
    },
    optimizeDeps: {
      include: ['front-matter'],
    },
    plugins: [
      // @module-federation/vite crashes when server.watch is boolean false (Vite 8 + Nx default).
      // This pre-enforce plugin ensures server.watch is an object before federation's config hook.
      {
        name: 'normalize-server-watch',
        enforce: 'pre' as const,
        config: () => ({ server: { watch: {} } }),
      },
      mode !== 'test' &&
        federation({
          name: 'host',
          filename: 'remoteEntry.js',
          dts: false,
          remotes: {
            'counter-remote': {
              type: 'module',
              name: 'counter-remote',
              entry: 'http://localhost:4201/remoteEntry.js',
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
        prerender: {
          routes: [],
        },
        content: {
          highlighter: 'shiki',
          shikiOptions: {
            highlighter: {
              additionalLangs: ['bash', 'shell', 'yaml', 'mermaid'],
              skipLangs: ['mermaid'],
            },
          },
        },
        fileReplacements:
          process.env['NX_TASK_TARGET_CONFIGURATION'] === 'preview'
            ? [
                {
                  replace: 'apps/web-app/src/environments/environment.ts',
                  with: 'apps/web-app/src/environments/environment.preview.ts',
                },
              ]
            : [],
      }),

      nxViteTsPaths(),

      VitePWA({
        registerType: 'prompt',
        injectRegister: null,
        devOptions: { enabled: false },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
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
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:60253',
          secure: false,
        },
      },
      fs: {
        allow: ['../../'],
      },
    },
    resolve: {
      alias:
        mode === 'test'
          ? {
              'counter-remote/Routes': resolve(
                __dirname,
                '../../libs/counter/src/lib/lib.routes.ts',
              ),
            }
          : {},
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});

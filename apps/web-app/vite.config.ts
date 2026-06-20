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
  // '@angular/compiler' intentionally NOT shared — the JIT compiler is
  // never needed at runtime in AOT production builds. Sharing it would
  // load ~216 KB (80 % unused) on every page view.
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
  // Angular CDK sub-paths (all declaration-bearing sub-paths used by CDK/Material)
  '@angular/cdk/a11y': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/bidi': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/layout': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/observers': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/overlay': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/portal': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/scrolling': { singleton: true, requiredVersion: cdkMatVer },
  '@angular/cdk/text-field': { singleton: true, requiredVersion: cdkMatVer },
  // NgRx - base signals shared (host provides, remote uses import:false).
  // @ngrx/signals/events is NOT shared - the federation plugin generates
  // buggy loadShare imports for sub-path modules. It's bundled directly.
  '@ngrx/signals': { singleton: true, requiredVersion: '~21.1.0' },
  // Spartan / Lucide — shared singletons to prevent NG0912 collisions
  // when the host and MFE remote both import the same component classes.
  'lucide-angular': { singleton: true, requiredVersion: '^1.0.0' },
  '@spartan-ng/brain/tooltip': { singleton: true, requiredVersion: '^0.0.1' },
  '@spartan-ng/brain/checkbox': { singleton: true, requiredVersion: '^0.0.1' },
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
    customLogger: {
      info(msg) {
        if (String(msg).includes('NG0912')) {
          return;
        }
        console.log(msg);
      },
      warn(msg) {
        if (String(msg).includes('NG0912')) {
          return;
        }
        console.warn(msg);
      },
      error(msg) {
        console.error(msg);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      clearScreen() {},
      hasErrorLogged() {
        return false;
      },
      hasWarned: false,
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
        // In test mode, use the fast-compile path so Angular components loaded
        // via MFE aliases (not in tsconfig.spec.json) are compiled with the
        // local single-pass AOT compiler, and non-Angular TS files are stripped
        // with OXC lang:'ts' — avoiding the NG0912/OXC JS-mode parse failures.
        fastCompile: mode === 'test',
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
              // In tests, stub the MFE remote with the real counter routes from the workspace lib.
              'counter-remote/Routes': resolve(
                __dirname,
                'src/test-stubs/counter-remote-routes.ts',
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

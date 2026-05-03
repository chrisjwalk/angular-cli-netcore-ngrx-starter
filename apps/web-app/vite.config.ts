/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { VitePWA } from 'vite-plugin-pwa';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite',
    build: {
      outDir: '../../dist/apps/web-app/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    optimizeDeps: {
      include: ['front-matter'],
    },
    plugins: [
      analog({
        ssr: false,
        static: true,
        prerender: {
          routes: [],
        },
        content: {
          highlighter: 'shiki',
          shikiOptions: {
            highlighter: {
              additionalLangs: ['bash', 'shell', 'yaml'],
            },
          },
        },
        fileReplacements:
          mode === 'preview'
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
          target: 'https://localhost:60254',
          secure: false,
        },
      },
      fs: {
        allow: ['../../'],
      },
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

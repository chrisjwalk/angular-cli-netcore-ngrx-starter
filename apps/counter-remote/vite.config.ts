import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { federation } from '@module-federation/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const sharedDeps = {
  '@angular/animations': { singleton: true, requiredVersion: '~21.2.15' },
  '@angular/common': { singleton: true, requiredVersion: '~21.2.15' },
  '@angular/compiler': { singleton: true, requiredVersion: '~21.2.15' },
  '@angular/core': { singleton: true, requiredVersion: '~21.2.15' },
  '@angular/platform-browser': { singleton: true, requiredVersion: '~21.2.15' },
  '@angular/platform-browser-dynamic': {
    singleton: true,
    requiredVersion: '~21.2.15',
  },
  '@angular/router': { singleton: true, requiredVersion: '~21.2.15' },
  rxjs: { singleton: true, requiredVersion: '~7.8.2' },
  tslib: { singleton: true, requiredVersion: '~2.8.1' },
};

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/counter-remote',
  build: {
    target: ['chrome89'],
    outDir: '../../dist/apps/counter-remote',
    reportCompressedSize: true,
    rolldownOptions: {
      external: ['virtual:pwa-register'],
    },
  },
  plugins: [
    mode !== 'test' &&
      federation({
        name: 'counter-remote',
        filename: 'remoteEntry.js',
        dts: false,
        exposes: {
          './Routes': './src/remote-routes.ts',
        },
        shared: sharedDeps,
      }),
    analog({ ssr: false }),
    nxViteTsPaths(),
  ].filter(Boolean),
  server: {
    port: 4201,
    origin: 'http://localhost:4201',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
    passWithNoTests: true,
  },
}));

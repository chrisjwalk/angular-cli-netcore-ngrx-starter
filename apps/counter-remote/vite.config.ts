import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { federation } from '@module-federation/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const angVer = '~21.2.15';
const cdkMatVer = '~21.2.13';

const sharedDeps = {
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
  // Workspace libs — omitted: MF virtual modules can't enumerate
  // export * chains from TypeScript path aliases (build breaks).
  // Utilities
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
    // @module-federation/vite crashes when server.watch is boolean false (Vite 8 + Nx default).
    {
      name: 'normalize-server-watch',
      enforce: 'pre' as const,
      config: () => ({ server: { watch: {} } }),
    },
    // virtual:pwa-register is provided by vite-plugin-pwa in the host.
    // Stub it out in the remote so shared libs resolve cleanly during dev-server pre-transform.
    {
      name: 'virtual-pwa-register-stub',
      resolveId: (id: string) =>
        id === 'virtual:pwa-register' ? '\0virtual:pwa-register' : undefined,
      load: (id: string) =>
        id === '\0virtual:pwa-register'
          ? 'export const registerSW = () => () => {};'
          : undefined,
    },
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

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { federation } from '@module-federation/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const angVer = '~21.2.15';
const cdkMatVer = '~21.2.13';

const sharedDeps = {
  // Angular core
  // Note: @angular/animations is not shared — counter-remote doesn't use
  // Angular animations. Removing it prevents the federation plugin from
  // bundling @angular/core internals into a loadShare that has its own
  // _injectImplementation (causing NG0203).
  // import:false — prevents a loadShare that bundles @angular/core internals
  // (assertInInjectionContext with its own _injectImplementation), causing NG0203
  '@angular/common': { singleton: true, requiredVersion: angVer },
  // import:false — prevents a loadShare that bundles @angular/core internals
  // (assertInInjectionContext), causing NG0203
  '@angular/common/http': { singleton: true, requiredVersion: angVer },
  '@angular/compiler': { singleton: true, requiredVersion: angVer },
  '@angular/core': { singleton: true, requiredVersion: angVer, import: false },
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
  // Angular CDK/Material sub-paths — import:false so the remote uses the host's
  // already-evaluated module instance rather than loading a second copy from its
  // own dev server. A top-level `import * as __mfLocalShare` in the generated
  // loadShare virtual module would otherwise cause Angular to register the same
  // component class twice, triggering NG0912 collisions at runtime.
  '@angular/cdk/a11y': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/bidi': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/layout': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/observers': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/overlay': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/portal': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/scrolling': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/cdk/text-field': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  // Angular Material sub-paths — same import:false reason as CDK above
  '@angular/material/badge': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/bottom-sheet': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/button': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/checkbox': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/core': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/form-field': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/divider': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/icon': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/input': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/list': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/paginator': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/progress-spinner': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/sidenav': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/snack-bar': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/table': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/toolbar': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/tooltip': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  // NgRx - base signals shared (host provides, remote uses import:false).
  // @ngrx/signals/events is NOT shared - the federation plugin generates
  // buggy loadShare imports for sub-path modules. It's bundled directly.
  '@ngrx/signals': {
    singleton: true,
    requiredVersion: '~21.1.0',
    import: false,
  },
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

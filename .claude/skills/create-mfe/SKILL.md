---
name: create-mfe
description: >
  Add a new micro-frontend (MFE) to this workspace. Use when asked to create a
  new remote app, expose a feature as a micro-frontend, or wire up a new remote
  to the host. Covers vite.config setup, shared singletons, NG0912 prevention,
  test stubs, and CI/deployment.
---

# Create a Micro-Frontend (MFE)

This workspace uses `@module-federation/vite` with `@analogjs/platform` (Analog.js)
on top of Nx. The host is `apps/web-app` (port 4200). Additional remotes follow
the pattern of `apps/counter-remote` (port 4201+).

---

## Architecture overview

```
apps/
  web-app/          ← host (Analog SPA, port 4200)
  counter-remote/   ← remote (Analog SPA, port 4201)
libs/
  counter/          ← workspace lib exposed by counter-remote
```

The remote **exposes one route file** (`./Routes`). The host **lazy-loads** it
via `loadChildren`. The two apps share Angular, CDK, Material, NgRx, and RxJS as
MF singletons so only one copy of each runs in the browser.

---

## Step 0 – Generate the remote app

```bash
# Generate a new Analog app in the workspace (adjust name/port as needed)
pnpm nx generate @analogjs/platform:app my-remote --directory=apps/my-remote
```

Then delete the generated `vite.config.ts` and replace it with the template in
Step 2. Delete generated routes/pages you don't need — the remote only needs a
`remote-routes.ts` entry point.

---

## Step 1 – Install the MF package (if not already present)

```bash
pnpm add @module-federation/vite
```

Verify it appears in `package.json` dependencies (not devDependencies — it's a
runtime bundler plugin).

---

## Step 2 – Configure the remote's `vite.config.ts`

Copy `apps/counter-remote/vite.config.ts` as your starting point. Key rules:

### Two required workaround plugins (always include both)

```typescript
// 1. @module-federation/vite crashes when server.watch is boolean false
//    (Vite 8 + Nx sets this by default). Must run pre-enforce.
{
  name: 'normalize-server-watch',
  enforce: 'pre' as const,
  config: () => ({ server: { watch: {} } }),
},

// 2. virtual:pwa-register is provided by VitePWA in the host only.
//    The remote must stub it so shared lib pre-transforms don't fail.
{
  name: 'virtual-pwa-register-stub',
  resolveId: (id: string) =>
    id === 'virtual:pwa-register' ? '\0virtual:pwa-register' : undefined,
  load: (id: string) =>
    id === '\0virtual:pwa-register'
      ? 'export const registerSW = () => () => {};'
      : undefined,
},
```

### Disable federation in test mode

```typescript
mode !== 'test' &&
  federation({
    name: 'my-remote',
    filename: 'remoteEntry.js',
    dts: false,
    exposes: {
      './Routes': './src/remote-routes.ts',
    },
    shared: sharedDeps,
  }),
```

Federation must be disabled in `mode === 'test'` — the MF virtual modules break
vitest's module resolver.

### External pwa-register from the build

```typescript
build: {
  rolldownOptions: {
    external: ['virtual:pwa-register'],
  },
},
```

### `sharedDeps` for the remote — `import: false` on CDK/Material

**Critical:** Angular CDK and Material packages must have `import: false` on the
**remote** (not on the host). Without this, `@module-federation/vite` generates a
loadShare virtual module with a top-level `import * as __mfLocalShare from
'@angular/material/button'`. This eagerly evaluates the module from the remote's
dev server (a different URL), causing Angular to register the same component class
twice → **NG0912 collisions at runtime**.

With `import: false`, MF generates a deferred-export module that reads Material
from the host's shared scope (`__mfModuleCache`) instead of loading its own copy.

```typescript
const angVer = '~21.x.x'; // match your @angular/core version
const cdkMatVer = '~21.x.x'; // match your @angular/cdk version

const sharedDeps = {
  // Angular core — no import:false needed (no component registrations that collide)
  '@angular/animations': { singleton: true, requiredVersion: angVer },
  '@angular/common': { singleton: true, requiredVersion: angVer },
  '@angular/common/http': { singleton: true, requiredVersion: angVer },
  '@angular/compiler': { singleton: true, requiredVersion: angVer },
  '@angular/core': { singleton: true, requiredVersion: angVer },
  '@angular/forms': { singleton: true, requiredVersion: angVer },
  '@angular/platform-browser': { singleton: true, requiredVersion: angVer },
  '@angular/platform-browser/animations': { singleton: true, requiredVersion: angVer },
  '@angular/platform-browser-dynamic': { singleton: true, requiredVersion: angVer },
  '@angular/router': { singleton: true, requiredVersion: angVer },

  // CDK sub-paths — import:false prevents NG0912 (see note above)
  '@angular/cdk/a11y': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/bidi': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/layout': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/observers': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/overlay': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/portal': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/scrolling': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/cdk/text-field': { singleton: true, requiredVersion: cdkMatVer, import: false },

  // Material sub-paths — import:false for same reason
  '@angular/material/badge': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/bottom-sheet': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/button': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/checkbox': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/core': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/divider': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/form-field': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/icon': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/input': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/list': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/paginator': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/progress-spinner': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/sidenav': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/snack-bar': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/table': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/toolbar': { singleton: true, requiredVersion: cdkMatVer, import: false },
  '@angular/material/tooltip': { singleton: true, requiredVersion: cdkMatVer, import: false },

  // NgRx + utilities
  '@ngrx/signals': { singleton: true, requiredVersion: '~21.x.x' },
  '@ngrx/signals/events': { singleton: true, requiredVersion: '~21.x.x' },
  rxjs: { singleton: true, requiredVersion: '~7.x.x' },
  tslib: { singleton: true, requiredVersion: '~2.x.x' },
};
```

> **Add only the CDK/Material sub-paths your remote actually uses.** If the
> remote later adds more Material imports, add their sub-paths here too.

> **Do NOT add `@myorg/*` workspace libs to the shared config.** MF uses Rolldown
> to build loadShare virtual modules, and Rolldown cannot enumerate `export *`
> chains from TypeScript path aliases. This causes `[MISSING_EXPORT]` build
> errors at runtime. Workspace libs should be bundled into the remote directly.

> **Use sub-paths, not root paths.** Declaring `'@angular/material': { ... }`
> (no trailing slash) only matches the exact bare specifier. It does NOT match
> `@angular/material/button`. You must list each sub-path explicitly.

---

## Step 3 – Configure the host's `vite.config.ts`

Add the remote to the host's federation config. The host's `sharedDeps` does
**not** need `import: false` — the host is the provider of these modules.

```typescript
// In apps/web-app/vite.config.ts

mode !== 'test' &&
  federation({
    name: 'host',
    filename: 'remoteEntry.js',
    dts: false,
    remotes: {
      'my-remote': {
        type: 'module',
        name: 'my-remote',
        entry:
          process.env['MY_REMOTE_ENTRY'] ??
          'http://localhost:4202/remoteEntry.js',  // remote's dev port
        entryGlobalName: 'my-remote',
        shareScope: 'default',
      },
      // keep existing remotes:
      'counter-remote': { ... },
    },
    exposes: {},
    shared: mfeSharedDeps,  // same shape as remote but WITHOUT import:false
  }),
```

The `MY_REMOTE_ENTRY` env var lets CI inject the production URL (see Step 7).

---

## Step 4 – Create the remote's entry point

```typescript
// apps/my-remote/src/remote-routes.ts
export { myFeatureRoutes } from '@myorg/my-feature';
```

This is the file exposed as `'./Routes'` in the federation config. It simply
re-exports the routes from a workspace lib (or defines them inline).

The workspace lib's route file should use `loadComponent` (not `component`) so
the component itself is still lazy-loaded by Angular's router:

```typescript
// libs/my-feature/src/lib/lib.routes.ts
import { Route } from '@angular/router';

export const myFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'My Feature',
    loadComponent: () => import('./components/my-feature/my-feature').then((m) => m.MyFeature),
    providers: [MyFeatureStore],
  },
];
```

---

## Step 5 – Add the route to the host app

```typescript
// apps/web-app/src/app/app.routes.ts
{
  path: 'my-feature',
  loadChildren: () =>
    import('my-remote/Routes').then((m) => m.myFeatureRoutes),
},
```

---

## Step 6 – Add a navigation link

```typescript
// libs/shared/src/lib/components/nav-links.ts
// Add to the navLinks array:
{ routerLink: '/my-feature', label: 'My Feature', icon: 'hub' },
```

---

## Step 7 – Integration tests: fastCompile + test stub

### Enable `fastCompile` on the host for test mode

MFE remote files (routes, stores, components) loaded through `import('my-remote/Routes')`
are **not in `tsconfig.spec.json`'s TypeScript program**. The standard Angular
Vite plugin cannot compile them, causing `@analogjs/vitest-angular-sourcemap-plugin`
to fall through to OXC in **JS mode** — which fails on TypeScript syntax like
`readonly`, type generics, or `export type`.

Fix: enable `fastCompile: mode === 'test'` in the host's `analog()` call.
The fast-compile plugin has its own single-pass AOT compiler that works on Angular
files _outside_ the TypeScript program, and it strips TypeScript from non-Angular
files using OXC in `lang: 'ts'` mode — so both are handled correctly.

```typescript
// apps/web-app/vite.config.ts
analog({
  ssr: false,
  static: true,
  // Use the fast-compile path in tests: compiles Angular components outside
  // tsconfig.spec.json (e.g. MFE stubs) and strips TS from plain .ts files.
  fastCompile: mode === 'test',
  prerender: { routes: [] },
  // ... rest of analog() options
}),
```

> `fastCompile` skips Angular's full template type-checking. This is fine for
> tests — template type errors show up in the IDE and in `tsc`, not at test run time.

### Create a test stub for the MFE route

The MFE's `remoteEntry.js` isn't available in vitest — it's a network resource.
Replace it with a local stub via a Vite alias:

```typescript
// apps/web-app/src/test-stubs/my-remote-routes.ts
// Stub for 'my-remote/Routes' used in tests.
// Imports the real component from the workspace lib directly so integration
// tests navigate and render the actual component, not a fake.
import { MyFeature } from '../../../../libs/my-feature/src/lib/components/my-feature/my-feature';

export const myFeatureRoutes = [
  {
    path: '',
    title: 'My Feature',
    component: MyFeature,
    providers: [],
  },
];
```

### Wire the stub in the host's vite.config (test mode only)

```typescript
// apps/web-app/vite.config.ts
import { resolve } from 'path';

resolve: {
  alias:
    mode === 'test'
      ? {
          'my-remote/Routes': resolve(
            __dirname,
            'src/test-stubs/my-remote-routes.ts',
          ),
          // keep existing stubs:
          'counter-remote/Routes': resolve(
            __dirname,
            'src/test-stubs/counter-remote-routes.ts',
          ),
        }
      : {},
},
```

---

## Step 8 – CI/preview deployment

### Build order in CI

The remote must be built **before** the host, and its output must be nested
inside the host's output directory:

```yaml
# .github/workflows/preview.yml (excerpt)

- name: Build my-remote (production)
  run: pnpm nx build my-remote --configuration production

- name: Copy my-remote output into web-app output
  run: |
    mkdir -p dist/apps/web-app/client/my-remote
    cp -r dist/apps/my-remote/* dist/apps/web-app/client/my-remote/

- name: Build web app (preview)
  env:
    COUNTER_REMOTE_ENTRY: /counter-remote/remoteEntry.js
    MY_REMOTE_ENTRY: /my-remote/remoteEntry.js
  run: pnpm nx build web-app --configuration preview
```

### SWA routing config

Azure Static Web Apps rewrites all unknown paths to `index.html` by default.
This breaks the remote's JS/asset requests. Exclude the remote's directory:

```json
// apps/web-app/src/staticwebapp.config.json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/*.{css,js,png,gif,ico,jpg,svg,webmanifest,woff,woff2,txt}", "/counter-remote/**", "/my-remote/**"]
  }
}
```

---

## Step 9 – Dev workflow

Start both apps in separate terminals:

```bash
# Terminal 1 — remote (must start first so host can connect on load)
pnpm nx serve my-remote

# Terminal 2 — host
pnpm nx serve web-app
```

The host references the remote at `http://localhost:4202/remoteEntry.js` (the
port set in `server.origin` of the remote's vite.config). If the remote isn't
running, the host still loads — the MFE route just fails to activate.

---

## Step 10 – Verify

```bash
# Build everything
pnpm nx run-many -t build

# Run all tests
pnpm nx run-many -t test
```

Open `http://localhost:4200/my-feature` — the MFE should load with zero NG0912
warnings in the browser console.

---

## Pitfall reference

| Symptom                                                                              | Root cause                                                                                                                                                                                                                       | Fix                                                                                               |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `NG0912` for Material/CDK components                                                 | Remote's loadShare virtual module has a top-level `import` that double-evaluates modules                                                                                                                                         | Add `import: false` to all CDK/Material entries in the **remote's** `sharedDeps`                  |
| `NG0912` for workspace lib components                                                | Workspace lib bundled into both host and remote                                                                                                                                                                                  | Remove the workspace lib from MF shared config; keep it as a direct dependency of the remote only |
| `[MISSING_EXPORT] "SomeExport"` build error                                          | `@myorg/*` workspace lib added to MF shared config; Rolldown can't enumerate `export *` from TS path aliases                                                                                                                     | Never put `@myorg/*` libs in MF shared config                                                     |
| `SyntaxError: Unexpected identifier` / `[PARSE_ERROR] Missing initializer` in vitest | Files reachable only via dynamic MFE import are not in `tsconfig.spec.json`'s program; `@analogjs/vitest-angular-sourcemap-plugin` falls through to OXC **JS mode** which fails on `readonly`, type generics, `export type` etc. | Add `fastCompile: mode === 'test'` to `analog()` in the host's `vite.config.ts`                   |
| Remote assets return `index.html` in Azure SWA preview                               | SWA's `navigationFallback` rewrites all unknown paths                                                                                                                                                                            | Add `/my-remote/**` to `navigationFallback.exclude` in `staticwebapp.config.json`                 |
| `Cannot read properties of undefined (reading 'watch')` on `pnpm nx serve`           | `@module-federation/vite` crashes when `server.watch` is `false` (Vite 8 + Nx default)                                                                                                                                           | Add the `normalize-server-watch` pre-enforce plugin to both host and remote                       |
| Remote's workspace lib styles missing                                                | `virtual:pwa-register` not resolved in remote                                                                                                                                                                                    | Add the `virtual-pwa-register-stub` plugin to the remote                                          |

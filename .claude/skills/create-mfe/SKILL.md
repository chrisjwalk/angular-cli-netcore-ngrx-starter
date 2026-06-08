---
name: create-mfe
description: >
  Add a new micro-frontend (MFE) to this workspace. Use when asked to create a
  new remote app, expose a feature as a micro-frontend, or wire up a new remote
  to the host. Covers vite.config setup, shared singletons, NG0912 prevention,
  test stubs, CI/deployment, and E2E.
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
pnpm nx generate @analogjs/platform:app my-remote --directory=apps/my-remote
```

Replace the generated `vite.config.ts` with the template in Step 3. **Keep** the
generated app shell files (`src/main.ts`, `src/app/app.ts`,
`src/app/app.config.ts`, `src/app/app.routes.ts`) — the remote needs these to
run as a standalone app via `nx serve` and in Playwright. Wire `app.routes.ts`
to spread the feature routes and add a wildcard fallback:

```typescript
// apps/my-remote/src/app/app.routes.ts
import { Route } from '@angular/router';
import { myFeatureRoutes } from '@myorg/my-feature';

export const routes: Route[] = [
  ...myFeatureRoutes,
  { path: '**', redirectTo: '' },
];
```

Delete generated pages/routes you don't need — the remote exposes its feature
via `remote-routes.ts`, not via Analog file-based routing.

---

## Step 1 – Create the workspace lib

Generate the feature lib if it doesn't exist:

```bash
pnpm nx generate @nx/angular:library my-feature --directory=libs/my-feature --standalone
```

Create `libs/my-feature/src/lib/lib.routes.ts`. Use `loadComponent` so the
component is still lazy-loaded by Angular's router:

```typescript
// libs/my-feature/src/lib/lib.routes.ts
import { Route } from '@angular/router';

export const myFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'My Feature',
    loadComponent: () =>
      import('./my-feature/my-feature').then((m) => m.MyFeature),
    providers: [MyFeatureStore],
  },
];
```

**Export the routes from the lib's barrel** (`libs/my-feature/src/index.ts`):

```typescript
export * from './lib/lib.routes';
// export * from './lib/my-feature.store';  // export the store too if needed
```

> Components do **not** need to be in the barrel unless something outside the lib
> imports them directly. The routes are all that the remote entry point and the
> test stub need.

---

## Step 2 – Install the MF package (if not already present)

```bash
pnpm add -D @module-federation/vite
```

`@module-federation/vite` is a build-time bundler plugin — it belongs in
`devDependencies`.

---

## Step 3 – Configure the remote's `vite.config.ts`

Copy `apps/counter-remote/vite.config.ts` as your starting point. After copying,
update these remote-specific values:

| Field                           | Example                                |
| ------------------------------- | -------------------------------------- |
| `cacheDir`                      | `../../node_modules/.vite/my-remote`   |
| `build.outDir`                  | `../../dist/apps/my-remote`            |
| `server.port` / `server.origin` | next available port, e.g. `4202`       |
| `federation({ name: ... })`     | `'my-remote'`                          |
| `federation({ exposes: ... })`  | `'./Routes': './src/remote-routes.ts'` |

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
// Use the exact versions from package.json (pnpm outdated to check)
const angVer = '~21.2.15';
const cdkMatVer = '~21.2.13';

const sharedDeps = {
  // Angular core — no import:false needed
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

  // CDK sub-paths — import:false prevents NG0912 (see note above)
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

  // Material sub-paths — import:false for same reason
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
  '@angular/material/divider': {
    singleton: true,
    requiredVersion: cdkMatVer,
    import: false,
  },
  '@angular/material/form-field': {
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

  // NgRx + utilities
  '@ngrx/signals': { singleton: true, requiredVersion: '~21.1.0' },
  '@ngrx/signals/events': { singleton: true, requiredVersion: '~21.1.0' },
  rxjs: { singleton: true, requiredVersion: '~7.8.2' },
  tslib: { singleton: true, requiredVersion: '~2.8.1' },
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

## Step 4 – Configure the host's `vite.config.ts`

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
      'counter-remote': { /* existing */ },
      'my-remote': {
        type: 'module',
        name: 'my-remote',
        entry:
          process.env['MY_REMOTE_ENTRY'] ??
          'http://localhost:4202/remoteEntry.js',
        entryGlobalName: 'my-remote',
        shareScope: 'default',
      },
    },
    exposes: {},
    shared: mfeSharedDeps,  // same shape as remote but WITHOUT import:false
  }),
```

The `MY_REMOTE_ENTRY` env var lets CI inject the production URL (see Step 8).

---

## Step 5 – Create the remote's entry point

```typescript
// apps/my-remote/src/remote-routes.ts
// Re-export from the lib barrel — this is what the host's loadChildren resolves.
export { myFeatureRoutes } from '@myorg/my-feature';
```

---

## Step 6 – Add the route to the host app

```typescript
// apps/web-app/src/app/app.routes.ts
{
  path: 'my-feature',
  loadChildren: () =>
    import('my-remote/Routes').then((m) => m.myFeatureRoutes),
},
```

Add a TypeScript module declaration so the import type-checks:

```typescript
// apps/web-app/src/types/remotes.d.ts  (add to existing file)
declare module 'my-remote/Routes' {
  import type { Route } from '@angular/router';
  export const myFeatureRoutes: Route[];
}
```

---

## Step 7 – Add a navigation link

```typescript
// libs/shared/src/lib/components/nav-links.ts
// Add to the navLinks array:
{ routerLink: '/my-feature', label: 'My Feature', icon: 'hub' },
```

---

## Step 8 – Integration tests: fastCompile + test stub

### Enable `fastCompile` on the host for test mode

MFE remote files loaded through `import('my-remote/Routes')` are **not in
`tsconfig.spec.json`'s TypeScript program**. The standard Angular Vite plugin
cannot compile them, causing `@analogjs/vitest-angular-sourcemap-plugin` to fall
through to OXC in **JS mode** — which fails on TypeScript syntax like `readonly`,
type generics, or `export type`.

Fix: enable `fastCompile: mode === 'test'` in the host's `analog()` call.

```typescript
// apps/web-app/vite.config.ts
analog({
  ssr: false,
  static: true,
  fastCompile: mode === 'test',
  prerender: { routes: [] },
}),
```

> `fastCompile` skips Angular's full template type-checking. Template errors
> still appear in the IDE and `tsc` — just not at vitest run time.

### Create a test stub for the MFE route

The MFE's `remoteEntry.js` isn't available in vitest. Replace it with a local
stub via a Vite alias.

**Preferred approach — re-export the lib's real routes:**

```typescript
// apps/web-app/src/test-stubs/my-remote-routes.ts
export { myFeatureRoutes } from '@myorg/my-feature';
```

This is the simplest and most correct stub. It uses the same routes the remote
uses, so integration tests exercise the real component without duplicating route
definitions.

> **Do NOT import the component directly unless it is in the lib's barrel
> (`index.ts`).** An `undefined` component causes `NG04014: Invalid configuration
of route` at test runtime. Always check what `libs/my-feature/src/index.ts`
> exports before importing from it.

### Wire the alias in the host's vite.config (test mode only)

```typescript
// apps/web-app/vite.config.ts
import { resolve } from 'path';

resolve: {
  alias:
    mode === 'test'
      ? {
          'counter-remote/Routes': resolve(__dirname, 'src/test-stubs/counter-remote-routes.ts'),
          'my-remote/Routes': resolve(__dirname, 'src/test-stubs/my-remote-routes.ts'),
        }
      : {},
},
```

---

## Step 9 – CI/preview and production deployment

### Build order: both apps first, then copy

The remote's output must be nested inside the host's output directory so it's
served from the same origin. **Always copy after both builds are done** — the
host build wipes and recreates its entire output directory, so any files copied
in before that step will be lost.

```yaml
# .github/workflows/preview.yml (and deploy.yml — same pattern)

- name: Build my-remote (production)
  run: pnpm nx build my-remote --configuration production

# Build the host AFTER the remote, setting env vars for all remotes
- name: Build web app
  env:
    COUNTER_REMOTE_ENTRY: /counter-remote/remoteEntry.js
    MY_REMOTE_ENTRY: /my-remote/remoteEntry.js
  run: pnpm nx build web-app --configuration production # or preview

# Copy AFTER both builds — never before
- name: Copy my-remote output into web-app output
  run: |
    mkdir -p dist/apps/web-app/client/my-remote
    cp -r dist/apps/my-remote/* dist/apps/web-app/client/my-remote/
```

### SWA routing config

Azure Static Web Apps rewrites unknown paths to `index.html` by default, which
breaks remote asset requests. Add the remote's directory to `navigationFallback.exclude`.

**Important:** Azure SWA allows at most **one `*`** per path segment. Using `**`
is invalid and causes deployment to fail with a validation error. Use two
separate entries per remote:

```json
// apps/web-app/src/staticwebapp.config.json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": [
      "/*.{css,js,png,gif,ico,jpg,svg,webmanifest,woff,woff2,txt}",
      "/counter-remote/*",
      "/counter-remote/assets/*",
      "/my-remote/*",
      "/my-remote/assets/*"
    ]
  }
}
```

---

## Step 10 – E2E tests

Add the remote's dev server to Playwright's `webServer` list. Remotes must
appear **before** the host entry. Keep the existing API and counter-remote
entries.

```typescript
// apps/web-app-e2e/playwright.config.ts
webServer: [
  {
    command: 'npx nx run api:serve',
    url: 'http://localhost:60253/health/live',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  {
    command: 'npx nx run counter-remote:serve',
    url: 'http://localhost:4201/remoteEntry.js',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  {
    command: 'npx nx run my-remote:serve',
    url: 'http://localhost:4202/remoteEntry.js',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  {
    command: 'npx nx run web-app:serve-e2e',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
],
```

In E2E specs, navigate to the route path defined in the **host** (e.g. `/my-feature`).

---

## Step 11 – Dev workflow

Start both apps in separate terminals:

```bash
# Terminal 1 — remote (must start first so host can connect on load)
pnpm nx serve my-remote

# Terminal 2 — host
pnpm nx serve web-app
```

The host references the remote at `http://localhost:4202/remoteEntry.js`. If the
remote isn't running the host still loads — the MFE route just fails to activate.

---

## Step 12 – Verify

```bash
pnpm nx run-many -t build
pnpm nx run-many -t test
pnpm e2e
```

Open `http://localhost:4200/my-feature` — the MFE should load with zero NG0912
warnings in the browser console.

---

## Pitfall reference

| Symptom                                                                              | Root cause                                                                                                                                          | Fix                                                                                                                        |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `NG0912` for Material/CDK components                                                 | Remote's loadShare virtual module has a top-level `import` that double-evaluates modules                                                            | Add `import: false` to all CDK/Material entries in the **remote's** `sharedDeps`                                           |
| `NG0912` for workspace lib components                                                | Workspace lib bundled into both host and remote                                                                                                     | Remove the workspace lib from MF shared config; bundle it into the remote directly                                         |
| `[MISSING_EXPORT] "SomeExport"` build error                                          | `@myorg/*` workspace lib added to MF shared config; Rolldown can't enumerate `export *` from TS path aliases                                        | Never put `@myorg/*` libs in MF shared config                                                                              |
| `SyntaxError: Unexpected identifier` / `[PARSE_ERROR] Missing initializer` in vitest | Files reachable only via dynamic MFE import are not in `tsconfig.spec.json`'s program; OXC falls through to JS mode and chokes on TypeScript syntax | Add `fastCompile: mode === 'test'` to `analog()` in the host's `vite.config.ts`                                            |
| `NG04014: Invalid configuration of route` in vitest                                  | Test stub imports a component not exported from the lib's barrel → `undefined` in route `component` field                                           | Re-export the lib's real routes: `export { myFeatureRoutes } from '@myorg/my-feature'`                                     |
| Remote files missing from preview / production deploy                                | Copy step ran before host build; host build wiped the output directory                                                                              | Build both apps first, then copy the remote output into the host's dist folder                                             |
| Remote assets return `index.html` in Azure SWA                                       | `navigationFallback` rewrites all unknown paths                                                                                                     | Add `/my-remote/*` AND `/my-remote/assets/*` (two separate entries); never use `/**` — SWA only allows one `*` per segment |
| `Cannot read properties of undefined (reading 'watch')` on `nx serve`                | `@module-federation/vite` crashes when `server.watch` is `false` (Vite 8 + Nx default)                                                              | Add the `normalize-server-watch` pre-enforce plugin to both host and remote                                                |
| `virtual:pwa-register` import error in remote                                        | VitePWA only runs in the host, not the remote                                                                                                       | Add the `virtual-pwa-register-stub` plugin to the remote's vite.config                                                     |

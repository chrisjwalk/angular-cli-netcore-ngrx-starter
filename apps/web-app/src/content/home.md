# Nx + Angular + .NET 10.0

A full-stack demo using an [Nx monorepo](https://nx.dev) with [Angular](https://angular.dev) (zoneless, signals) and a .NET 10.0 Web API backend. Deployed to Azure App Service with automated PR preview deployments via Azure Static Web Apps.

## Features

- **Server-side CRUD reference** — the Todos feature demonstrates the canonical enterprise pattern: EF Core persistence, server-side pagination, sorting, and filtering with NgRx SignalStore and stable signal-based forms
- **Authentication** — register, login, and logout with JWT bearer tokens backed by ASP.NET Core Identity
- **Notification center** — persistent notification panel with unread count, mark-as-read, dismiss, and action support (e.g. one-click reload on SW update)
- **PWA / service worker** — offline support; notifies users when a new app version is available with an in-app prompt to reload
- **Markdown content pages** — [Analog.js](https://analogjs.org) content feature renders pages from Markdown files with frontmatter support (see the [About](/about) page for a live demo)
- **Counter micro frontend** — the Counter feature runs as a separate [Module Federation](https://module-federation.io/) remote (`counter-remote`), demonstrating micro-frontend architecture with shared singleton libraries
- **Debug page** (`/debug`) — trigger test notifications and inspect service worker update state during development
- **PR preview deployments** — every pull request gets a live preview URL via Azure Static Web Apps

## Tech stack

**Frontend**

- [Angular 22](https://angular.dev) — zoneless change detection, standalone components, signals
- [NgRx Signal Store](https://ngrx.io/guide/signals) — reactive state management
- [Angular Material](https://material.angular.io) — UI component library
- [Analog.js](https://analogjs.org) — Vite-native Angular meta-framework; used for file-based Markdown content pages
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [Angular PWA](https://angular.dev/ecosystem/service-workers) — service worker & offline support
- [Module Federation](https://module-federation.io/) (`@module-federation/vite`) — micro-frontend architecture

**Backend**

- [.NET 10.0](https://dotnet.microsoft.com) Web API
- [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity) — bearer token authentication
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) with Azure SQL

**Tooling**

- [Nx](https://nx.dev) — monorepo build system with affected commands
- [Vitest](https://vitest.dev) — unit tests with ~93% line coverage
- [Playwright](https://playwright.dev) — end-to-end tests
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) — pre-commit hooks for linting, formatting, and keeping `home.md` in sync
- [pnpm](https://pnpm.io) — package manager

## Demo

Live demo: [https://angularclinetcorengrxstarter.azurewebsites.net/](https://angularclinetcorengrxstarter.azurewebsites.net/)

## Getting started

**Prerequisites**

- Node 24.x+ with pnpm 10+
- .NET SDK 10.0.x — [download](https://dotnet.microsoft.com/download)

**Install dependencies**

```bash
pnpm install
```

## Serve development app

```bash
pnpm start
```

Starts both the .NET API and Angular app in dev mode. Open [http://localhost:4200](http://localhost:4200) for the app, or [https://localhost:60254/swagger](https://localhost:60254/swagger) for the API docs.

## Micro-frontend development

The Counter feature is a [Module Federation](https://module-federation.io/) micro-frontend remote. To develop with the MFE active, start both servers in separate terminals:

```bash
# Terminal 1 — remote (port 4201)
pnpm nx serve counter-remote

# Terminal 2 — host (port 4200)
pnpm nx serve web-app
```

The host at `http://localhost:4200` will load the Counter remote automatically from `http://localhost:4201/remoteEntry.js` when you navigate to `/mfe-counter`.

### Architecture

| App              | Role       | Port | Description                                   |
| ---------------- | ---------- | ---- | --------------------------------------------- |
| `web-app`        | MFE host   | 4200 | Main application shell                        |
| `counter-remote` | MFE remote | 4201 | Counter feature exposed via Module Federation |

**Shared singletons** — Angular core, CDK/Material, and NgRx are configured as Module Federation singletons so both apps share a single instance. This prevents Angular's NG0912 component-ID collision warnings that occur when the same component class is registered twice.

**Remote self-containment** — workspace libs (`@myorg/shared`, `@myorg/counter`) are NOT in the MF shared config because Rolldown's static analysis cannot enumerate `export *` chains from TypeScript path aliases. Instead, the remote is designed to be self-contained: `counter-remote` bundles only `@myorg/counter` (which has no `@myorg/shared` dependencies), and the host bundles `@myorg/shared` exclusively (no duplicate registrations).

**Preview deployments** — in CI, `counter-remote` is built and served from `/counter-remote/` within the same Static Web App as the host. The `COUNTER_REMOTE_ENTRY` environment variable is set to `/counter-remote/remoteEntry.js` during the host build so the baked-in import map points to the co-deployed remote instead of `localhost`.

## Lint

```bash
pnpm lint
```

## Unit tests

```bash
pnpm test
```

Coverage requires `dotnet-coverage`:

```bash
dotnet tool install --global dotnet-coverage
```

## End-to-end tests

```bash
pnpm e2e
```

## Build for production

```bash
pnpm build:prod
```

Builds the Angular app and publishes the .NET project to `/dist`, ready to deploy to Azure App Service.

## Recipes

A [recipe catalog](docs/README.md) documents every pattern in this repo — feature libraries, SignalStore, server-side CRUD, signal forms, error handling, EF migrations, auth, testing, theming, MFEs, and deployment. Each recipe points at its canonical implementation files; the code is the source of truth.

## Contributing

`apps/web-app/src/assets/home.md` is auto-generated from this file — **edit `README.md` only**. The lint-staged hook regenerates `home.md` automatically whenever `README.md` is committed.

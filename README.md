[![CI](https://github.com/chrisjwalk/angular-cli-netcore-ngrx-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/chrisjwalk/angular-cli-netcore-ngrx-starter/actions/workflows/ci.yml)

# Nx + Angular + .NET 10.0

A full-stack demo using an [Nx monorepo](https://nx.dev) with [Angular](https://angular.dev) (zoneless, signals) and a .NET 10.0 Web API backend. Deployed to Azure App Service with automated PR preview deployments via Azure Static Web Apps.

## Features

- **Authentication** — register, login, and logout with JWT bearer tokens backed by ASP.NET Core Identity
- **Notification center** — persistent notification panel with unread count, mark-as-read, dismiss, and action support (e.g. one-click reload on SW update)
- **PWA / service worker** — offline support; notifies users when a new app version is available with an in-app prompt to reload
- **Debug page** (`/debug`) — trigger test notifications and inspect service worker update state during development
- **PR preview deployments** — every pull request gets a live preview URL via Azure Static Web Apps

## Tech stack

**Frontend**

- [Angular 21](https://angular.dev) — zoneless change detection, standalone components, signals
- [NgRx Signal Store](https://ngrx.io/guide/signals) — reactive state management
- [Angular Material](https://material.angular.io) — UI component library
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [Angular PWA](https://angular.dev/ecosystem/service-workers) — service worker & offline support

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

## Contributing

`apps/web-app/src/assets/home.md` is auto-generated from this file — **edit `README.md` only**. The lint-staged hook regenerates `home.md` automatically whenever `README.md` is committed.

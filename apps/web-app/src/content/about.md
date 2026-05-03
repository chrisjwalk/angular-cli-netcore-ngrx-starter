---
title: About
description: About this starter project
---

## About This Starter

This is a full-stack starter template demonstrating modern Angular and .NET development practices.

### Tech Stack

**Frontend**

- [Angular 21](https://angular.dev) — Zoneless, signals-first
- [NgRx Signal Store](https://ngrx.io/guide/signals/signal-store) — Reactive state management
- [Angular Material](https://material.angular.io) — UI component library
- [Analog.js](https://analogjs.org) — Vite-native Angular meta-framework
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling

**Backend**

- [.NET 10](https://dotnet.microsoft.com) — Web API

**Tooling**

- [Nx](https://nx.dev) — Monorepo build system
- [Vite](https://vitejs.dev) — Development server and bundler
- [Vitest](https://vitest.dev) — Unit testing framework
- [pnpm](https://pnpm.io) — Fast, disk-efficient package manager

### Features

- Zoneless Angular with `provideZonelessChangeDetection`
- Signal-based state with NgRx Signal Store
- Markdown content pages via Analog.js
- Progressive Web App (PWA) support
- JWT authentication flow
- Lazy-loaded feature modules
- Full CI/CD pipeline with GitHub Actions

### Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/chrisjwalk/angular-cli-netcore-ngrx-starter
cd angular-cli-netcore-ngrx-starter
pnpm install
```

Start the full stack in one command:

```bash
pnpm nx serve web-app
```

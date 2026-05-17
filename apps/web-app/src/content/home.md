# Nx + Angular + .NET 10.0

A full-stack demo using an [Nx monorepo](https://nx.dev) with [Angular](https://angular.dev) (zoneless, signals) and a .NET 10.0 Web API backend. Deployed to Azure App Service with automated PR preview deployments via Azure Static Web Apps.

## What's Here

This demo app is a working full-stack starter. Everything you see is connected to a real .NET 10.0 backend — sign up for an account and explore the features below.

## Features

### [To-do list](/todos)

Create, complete, and delete to-dos backed by Entity Framework Core and Azure SQL. Demonstrates CRUD operations with optimistic UI updates via NgRx Signal Store.

### [Weather forecast](/weather-forecast)

Fetches live data from the .NET API and displays a 5-day weather forecast. A simple example of an Angular service calling a protected API endpoint.

### [Counter](/feature)

A minimal NgRx Signal Store example — increment, decrement, and reset a counter with undo/redo support. A good starting point for understanding the signal store pattern used throughout this app.

### [Content pages](/about)

This page and the [About](/about) page are rendered from Markdown files using [Analog.js](https://analogjs.org). Frontmatter, syntax highlighting via Shiki, Mermaid diagrams, and a generated table of contents — all resolved at build time.

## Notifications

Click the bell icon in the top-right corner to open the notification center. Notifications persist across sessions, support mark-as-read, dismiss, and action buttons. The service worker update prompt also surfaces here when a new version of the app is deployed.

## PWA

This app is a Progressive Web App. On supported browsers you can install it to your home screen. If you're offline, previously visited pages continue to work from the service worker cache.

## Source

The source is on [GitHub](https://github.com/chrisjwalk/angular-cli-netcore-ngrx-starter). The stack is Angular 21 (zoneless, signals), NgRx Signal Store, Angular Material, Tailwind CSS v4, and .NET 10.0 — built and tested with [Vite+](https://viteplus.dev).

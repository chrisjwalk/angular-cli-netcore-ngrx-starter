# Recipe Catalog

Short recipes for the patterns implemented in this repo. The **code is the source of truth** — each recipe points at its canonical implementation files rather than duplicating them. When code and recipe disagree, fix the recipe and link to the code.

These are written for both humans and coding agents: drop the relevant recipe (or this whole directory) into a prompt as context. Browsing the catalog in the running app is tracked in issue #216.

## Writing a recipe

1. Keep it short — purpose, canonical file links, conventions & gotchas, related links.
2. `canonical:` frontmatter lists the files that demonstrate the pattern.
3. Update the `updated:` date when the pattern meaningfully changes.

## Recipes

| Recipe                                              | Area         | Canonical implementation                                                                                                                        |
| --------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [Feature library](recipes/feature-library.md)       | frontend     | `libs/todo` structure, `libs/shared/src/lib/components/nav-links.ts`, `apps/web-app/src/app/app.routes.ts`                                      |
| [SignalStore state](recipes/signal-store.md)        | frontend     | `libs/todo/src/lib/state/todo.store.ts`, `libs/auth/src/lib/state/auth.store.ts`, `libs/counter/src/lib/state/counter.store.ts`                 |
| [Server-side CRUD](recipes/server-crud.md)          | fullstack    | `apps/api/Api/Endpoints/TodoEndpoints.cs`, `libs/todo`                                                                                          |
| [Signal forms](recipes/signal-forms.md)             | frontend     | `libs/todo/src/lib/components/todo-form/todo-form.ts`                                                                                           |
| [Error handling](recipes/error-handling.md)         | frontend     | `libs/todo/src/lib/components/todo-page/todo-page.ts`, `libs/shared/src/lib/state/notification.store.ts`                                        |
| [Notification center](recipes/notifications.md)     | frontend     | `libs/shared/src/lib/state/notification.store.ts`, `libs/shared/src/lib/components/notification-bell.ts`, `apps/web-app/src/app/debug/debug.ts` |
| [Route guards](recipes/auth-guards.md)              | frontend     | `libs/auth/src/lib/state/auth.store.ts`, `libs/weather-forecast/src/lib/lib.routes.ts`                                                          |
| [HTTP interceptors](recipes/http-interceptors.md)   | frontend     | `apps/web-app/src/app/app.config.ts`, `libs/auth/src/lib/state/auth.interceptor.ts`                                                             |
| [Minimal APIs](recipes/minimal-api-ef.md)           | backend      | `apps/api/Api/Endpoints/`, `apps/api/Api/DbContext.cs`                                                                                          |
| [EF migrations](recipes/ef-migrations.md)           | backend      | `apps/api/Api/Migrations/`, `apps/api/Api/Program.cs`                                                                                           |
| [JWT auth](recipes/auth-jwt.md)                     | fullstack    | `apps/api/Api/Endpoints/AuthEndpoints.cs`, `libs/auth`                                                                                          |
| [Testing](recipes/testing.md)                       | testing      | `libs/todo/src/lib/state/todo.store.spec.ts`, `apps/api/Api.Test/UnitTest.cs`, `apps/web-app-e2e/src/weather-forecast.e2e.spec.ts`              |
| [Markdown content pages](recipes/analog-content.md) | frontend     | `apps/web-app/src/app/content/`, `libs/home/src/lib/home/home.ts`                                                                               |
| [PWA & service worker](recipes/pwa.md)              | frontend     | `apps/web-app/vite.config.ts`, `libs/shared/src/lib/state/sw-update.store.ts`                                                                   |
| [Theming](recipes/theming.md)                       | frontend     | `apps/web-app/src/styles/`, `libs/shared/src/lib/components/theme.service.ts`                                                                   |
| [Micro-frontends](recipes/mfe.md)                   | architecture | `apps/counter-remote`, `.claude/skills/create-mfe/SKILL.md`                                                                                     |
| [Counter feature](recipes/counter.md)               | frontend     | `libs/counter/src/lib/state/counter.store.ts`, `apps/counter-remote/src/remote-routes.ts`                                                       |
| [Weather forecast](recipes/weather-forecast.md)     | fullstack    | `libs/weather-forecast/src/lib/state/weather-forecast.store.ts`, `libs/weather-forecast/src/lib/services/weather-forecast.service.ts`           |
| [Deployment & CI](recipes/deployment.md)            | devops       | `.github/workflows/`                                                                                                                            |
| [Dependency updates](recipes/dependency-updates.md) | devops       | `.claude/skills/update-packages/SKILL.md`, `tools/update-packages`                                                                              |

## Agent skills

The repo's Claude skills codify _procedures_ (scaffolding, updates) that complement these recipes:

- `.claude/skills/recipes/SKILL.md` — dispatch into this catalog: map a task to its recipe(s), load them + their canonical files, and follow the conventions
- `.claude/skills/create-signalstore/SKILL.md` — store generation patterns
- `.claude/skills/create-mfe/SKILL.md` — micro-frontend scaffolding
- `.claude/skills/create-feature/SKILL.md` — full feature scaffolding
- `.claude/skills/update-packages/SKILL.md` — dependency updates
- `.claude/skills/upgrade-angular-major/SKILL.md` — Angular major upgrades

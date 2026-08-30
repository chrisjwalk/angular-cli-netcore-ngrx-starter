---
title: Server-side CRUD (minimal API + SignalStore)
area: fullstack
canonical: [apps/api/Api/Endpoints/TodoEndpoints.cs, libs/todo/src/lib/services/todo.service.ts, libs/todo/src/lib/state/todo.store.ts, libs/todo/src/lib/components/todo-page/todo-page.ts, libs/todo/src/lib/components/todo-list/todo-list.ts]
updated: 2026-08-16
---

# Server-side CRUD

The todo feature is the canonical full-stack CRUD loop: a minimal-API group over an in-memory repository, and a SignalStore-driven UI (create form, toggle, delete, plus load/mutation error banners).

## Canonical implementation

- **API** — `apps/api/Api/Endpoints/TodoEndpoints.cs`: `MapGroup("/api/todos")` + `WithTags("Todos")`; `GET` (ordered by `CreatedAt`), `POST` → `Results.Created`, `PATCH` (null fields = unchanged), `DELETE` → `NoContent`/`NotFound`. Positional record DTOs (`CreateTodoRequest`/`UpdateTodoRequest`) live in the same file.
- **Repository** — `TodoRepository` in the same file: `ConcurrentDictionary` singleton registered in `Program.cs`; `CreatedAt` is a UTC ISO-8601 string so the lexical order is chronological.
- **Service** — `libs/todo/src/lib/services/todo.service.ts`: all HTTP via `HttpClient`, `providedIn: 'root'`.
- **Store** — `libs/todo/src/lib/state/todo.store.ts`: `rxResource` with a `computed` params signal (the `syncEnabled` toggle demo), `rxMethod` + `tapResponse` mutations, `reload()` after each mutation.
- **UI** — `todo-page.ts` (dismissible `mutationError` banner, `rxResource` error banner with retry) + `todo-list.ts` fed `todos.value() ?? []`.

## Conventions & gotchas

- **`rxResource.value()` dips to `undefined` during refetches** — `todo-page` passes `todos.value() ?? []` into the list so components never see undefined.
- `mutationError` is a single string cleared on success and dismissed manually — one source for form-level failures.
- The in-memory repository loses data on restart and is not multi-instance safe — fine for the demo; for persistence, EF Core is the pattern (see minimal-api-ef).
- Route-scoped store: `providers: [TodoStore]` in `lib.routes.ts` so state dies with the route.
- PATCH partial updates use a record `with` expression — explicit `null` means "unchanged", which is why `UpdateTodoRequest` fields are nullable.

## Related

- [SignalStore state](signal-store.md) · [Signal forms](signal-forms.md) · [Minimal APIs](minimal-api-ef.md) · [Testing](testing.md) · [Feature library](feature-library.md)

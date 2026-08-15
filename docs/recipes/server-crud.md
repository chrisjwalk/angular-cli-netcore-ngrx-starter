---
title: Server-side CRUD with paging, sorting, and filtering
area: fullstack
canonical: [apps/api/Api/Endpoints/TodoEndpoints.cs, apps/api/Api/Services/TodoRepository.cs, libs/todo/src/lib/state/todo.store.ts, libs/todo/src/lib/components/todo-page/todo-page.ts, libs/todo/src/lib/components/todo-list/todo-list.ts]
updated: 2026-08-15
---

# Server-side CRUD with paging, sorting, and filtering

The todo feature is the repo's flagship enterprise CRUD reference: EF Core persistence, a paged/sorted/filtered minimal API, and a SignalStore-driven UI with server-side `MatSort`/`MatPaginator`.

## Canonical implementation

- **API** — `apps/api/Api/Endpoints/TodoEndpoints.cs`: `GET /api/todos?page=&pageSize=&sortBy=&sortDir=&filter=` returning `{ items, totalCount, page, pageSize }`; invalid query params and bodies return `400 ValidationProblemDetails`
- **Repository** — `apps/api/Api/Services/TodoRepository.cs`: sort whitelist maps query keys to `Expression<Func<TodoItem, object>>` (never flow request strings into EF); filter is a case-insensitive contains; `ThenBy(t => t.Id)` tie-breaks for stable paging
- **Store** — `libs/todo/src/lib/state/todo.store.ts`: page/pageSize/sortBy/sortDir/filter state → `computed` params → `rxResource`; debounced `updateFilter`; deleting the last item on page > 1 decrements the page
- **UI** — `todo-page.ts` (filter input, server paginator, edit wiring) + `todo-list.ts` (mat-table fed directly with `[dataSource]="todos()"`, no `MatTableDataSource`)

## Conventions & gotchas

- Sort keys are whitelisted on the API (400 on unknown) and cast from `MatSortChange` on the client (`setSort` falls back to `createdAt`/`desc` on clear).
- **Material 22 `MatSort.sort()` toggles direction when the id matches the active header and ALWAYS emits `sortChange`.** Only sync store state into MatSort while no header is active (`!sort.active`), otherwise every store update re-toggles the user's click.
- **Don't swap the table out for a skeleton during reloads** — destroying `mat-table` recreates `MatSort`, whose re-created instance re-fires the sync effect and resets page state. Keep rows mounted and dim with `[class.opacity-60]="loading()"`.
- **Keep `totalCount` stable during refetches** (see signal-store recipe) or the paginator clamps `pageIndex` and emits a page event that reverts the page.
- E2E timing: HTTP response resolution ≠ Angular render. Poll with `expect(...).toPass()` instead of reading the DOM right after `waitForResponse`.

## Related

- [SignalStore state](signal-store.md) · [Signal forms](signal-forms.md) · [Minimal APIs + EF Core](minimal-api-ef.md) · [EF migrations](ef-migrations.md) · [Testing](testing.md)

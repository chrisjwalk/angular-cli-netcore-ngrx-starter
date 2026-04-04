---
name: create-signalstore
description: >
  Create a new NgRx SignalStore following the patterns used in this codebase.
  Use when asked to add a new store, state slice, or signal-based state
  container. Produces feature functions first, combines them in signalStore(),
  and adds a spec file.
---

# Create a NgRx SignalStore

## Step 0 – Ask the user what kind of store they need

Before writing any code, ask these two questions:

> **1. What kind of store do you need?**
>
> - **Simple state store** — plain state fields, computed values, methods (no entity list)
> - **Entity store** — a collection of items managed with `withEntities` (CRUD list, e.g. users, products)
> - **Event-driven store** — Redux-style, using `eventGroup` + `withReducer` for explicit actions (e.g. counter, form)

> **2. Does it need to load data from an external source (HTTP API, etc.)?**
>
> - **Yes, primarily reading/fetching** → use `rxResource` (Angular's built-in resource API — loading, error, and value signals for free, auto-refetches when params change)
> - **Yes, also needs mutations** (create/update/delete) → use `rxMethod` for those alongside `rxResource`
> - **No external data** → skip both

> **3. Should it be a singleton** (`providedIn: 'root'`) or **scoped** to a component/route?

Then follow the relevant section below.

---

## Core rules (apply to all store types)

- **Features first, store second.** Write `withXxxFeature()` functions using `signalStoreFeature()`, then combine in `signalStore()`.
- **`rxMethod`** (from `@ngrx/signals/rxjs-interop`) for RxJS side effects. Never subscribe manually. Accepts a static value, a signal, or an Observable — pass a signal to track it reactively.
- **`signalMethod`** (from `@ngrx/signals`) to react to signal changes. Prefer over `effect()`.
- **`withProps`** to inject services; expose them to downstream `withMethods`.
- **`withHooks`** in its own feature function for `onInit`/`onDestroy` logic.
- Export both the class and its instance type: `export type XxxStore = InstanceType<typeof XxxStore>;`

---

## Loading external data with `rxResource` (preferred for reads)

`rxResource` (from `@angular/core/rxjs-interop`) is the preferred way to load data from an API. It automatically provides `.value`, `.isLoading()`, `.error()`, and `.reload()` signals — no need for `withLoadingFeature`.

Place the resource in `withProps` so it's accessible to downstream `withMethods` and `withHooks`:

```typescript
import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStore, signalStoreFeature, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';

export type MyState = { query: string };
export const myInitialState: MyState = { query: '' };

export function withMyFeature() {
  return signalStoreFeature(
    withState(myInitialState),
    withProps(() => ({
      myService: inject(MyService),
    })),
    // Build the params signal first so rxResource can track it:
    withComputed(({ query }) => ({
      params: computed(() => ({ query: query() })),
    })),
    withProps(({ myService, params }) => ({
      // rxResource re-fetches automatically whenever params signal changes:
      results: rxResource({
        params,
        stream: ({ params: { query } }) => myService.search(query),
      }),
    })),
    withMethods(({ results, ...store }) => ({
      setQuery(query: string) {
        patchState(store, { query });
      },
      reload() {
        results.reload();
      },
    })),
  );
}

export const MyStore = signalStore(withMyFeature(), withHooks({ onInit: ({ setQuery }) => setQuery('') }));
```

**Using the resource in a template:**

```typescript
// In component:
readonly store = inject(MyStore);

// In template:
@if (store.results.isLoading()) { <mat-spinner /> }
@if (store.results.error()) { <p>Error loading data</p> }
@for (item of store.results.value(); track item.id) { ... }
```

**For mutations, use `rxMethod` alongside the resource:**

```typescript
withMethods(({ myService, results, ...store }) => ({
  create: rxMethod<NewItem>(
    pipe(
      switchMap((item) =>
        myService.create(item).pipe(
          tapResponse({
            next: () => results.reload(), // reload after mutation
            error: (error) => patchState(store, { error }),
          }),
        ),
      ),
    ),
  ),
}));
```

**Testing `rxResource` — requires `await appRef.whenStable()`:**

```typescript
import { ApplicationRef } from '@angular/core';
import { of, throwError } from 'rxjs';

it('should load results', async () => {
  const appRef = TestBed.inject(ApplicationRef);
  vi.spyOn(service, 'search').mockReturnValue(of([mockItem]));

  store.setQuery('hello');
  await appRef.whenStable();

  expect(store.results.value()).toEqual([mockItem]);
  expect(store.results.isLoading()).toBe(false);
  expect(store.results.error()).toBeFalsy();
});

it('should capture error', async () => {
  const appRef = TestBed.inject(ApplicationRef);
  vi.spyOn(service, 'search').mockReturnValue(throwError(() => new Error('oops')));

  store.setQuery('hello');
  await appRef.whenStable();

  expect(store.results.error()).toBeTruthy();
  expect(store.results.isLoading()).toBe(false);
});
```

> Use `rxMethod` with `withLoadingFeature()` instead of `rxResource` when you need synchronous loading (e.g. entity stores backed by `withEntities` where you control the state directly), or for fire-and-forget mutations that don't need their own value signal.

---

Use when you have plain state + computed values + methods. No entity collection.

```typescript
import { computed, inject } from '@angular/core';
import { patchState, signalStore, signalStoreFeature, withComputed, withHooks, withMethods, withProps, withState, type } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';

// Optional — remove if no async work needed:
import { withLoadingFeature } from '@myorg/shared';

export type MyState = {
  selectedId: string | null;
  query: string;
};

export const myInitialState: MyState = {
  selectedId: null,
  query: '',
};

export function withMyFeature() {
  return signalStoreFeature(
    withLoadingFeature(), // remove if no async work
    withState(myInitialState),
    withProps(() => ({
      myService: inject(MyService),
    })),
    withComputed(({ query }) => ({
      trimmedQuery: computed(() => query().trim()),
    })),
    withMethods(({ myService, ...store }) => ({
      setQuery(query: string) {
        patchState(store, { query });
      },
      load: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((q) =>
            myService.search(q).pipe(
              tapResponse({
                next: (result) => patchState(store, { result, loading: false }),
                error: (error) => patchState(store, { error, loading: false }),
              }),
            ),
          ),
        ),
      ),
    })),
  );
}

export function withMyHooks() {
  return signalStoreFeature(
    { methods: type<{ load: ReturnType<typeof rxMethod<string>> }>() },
    withHooks({
      onInit({ load }, store = inject(MyStore)) {
        // Pass a signal to load — it will re-run whenever trimmedQuery changes.
        load(store.trimmedQuery);
      },
    }),
  );
}

export const MyStore = signalStore(
  // { providedIn: 'root' },  ← singleton
  withMyFeature(),
  withMyHooks(),
);

export type MyStore = InstanceType<typeof MyStore>;
```

### `withLinkedState` — derived writable state

Use `withLinkedState` instead of `withComputed` when the derived value also needs to be writable (e.g. a selection that resets when the source list changes):

```typescript
import { linkedSignal } from '@angular/core';
import { withLinkedState } from '@ngrx/signals';

withLinkedState(({ options }) => ({
  // Simple computation — resets to first option whenever options change:
  selectedOption: () => options()[0],

  // Advanced — preserve selection if it still exists in the new list:
  selectedOption: linkedSignal<Option[], Option>({
    source: options,
    computation: (newOptions, previous) => newOptions.find((o) => o.id === previous?.value.id) ?? newOptions[0],
  }),
}));
```

---

## 2. Entity store

Use when managing a collection of items. Provides `entityMap`, `ids`, and `entities` signals automatically.

```typescript
import { computed, inject } from '@angular/core';
import { patchState, signalStore, signalStoreFeature, withComputed, withHooks, withMethods, withProps, withState, type } from '@ngrx/signals';
import {
  addEntity,
  addEntities,
  removeEntity,
  removeEntities,
  removeAllEntities,
  setEntity,
  setEntities,
  setAllEntities,
  updateEntity,
  updateEntities,
  upsertEntity,
  upsertEntities,
  withEntities,
  // Named collection variant (see below):
  // entityConfig,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { withLoadingFeature } from '@myorg/shared';

export type Todo = { id: string; text: string; completed: boolean };

export function withTodosFeature() {
  return signalStoreFeature(
    withLoadingFeature(),
    withEntities<Todo>(),
    withState({ filter: 'all' as 'all' | 'active' | 'completed' }),
    withProps(() => ({ todosService: inject(TodosService) })),
    withComputed(({ entities, filter }) => ({
      filtered: computed(() => {
        const f = filter();
        if (f === 'active') return entities().filter((t) => !t.completed);
        if (f === 'completed') return entities().filter((t) => t.completed);
        return entities();
      }),
    })),
    withMethods(({ todosService, ...store }) => ({
      setFilter(filter: 'all' | 'active' | 'completed') {
        patchState(store, { filter });
      },
      loadAll: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            todosService.getAll().pipe(
              tapResponse({
                next: (todos) => patchState(store, setAllEntities(todos), { loading: false }),
                error: (error) => patchState(store, { error, loading: false }),
              }),
            ),
          ),
        ),
      ),
      add: rxMethod<Omit<Todo, 'id'>>(
        pipe(
          switchMap((todo) =>
            todosService.create(todo).pipe(
              tapResponse({
                next: (created) => patchState(store, addEntity(created)),
                error: (error) => patchState(store, { error }),
              }),
            ),
          ),
        ),
      ),
      toggle(id: string) {
        patchState(store, updateEntity({ id, changes: (t) => ({ completed: !t.completed }) }));
      },
      remove(id: string) {
        patchState(store, removeEntity(id));
      },
    })),
  );
}

export const TodosStore = signalStore(withTodosFeature(), withHooks({ onInit: ({ loadAll }) => loadAll() }));

export type TodosStore = InstanceType<typeof TodosStore>;
```

### Custom ID selector

If your entity's ID field isn't named `id`:

```typescript
withEntities<WeatherForecast>();
// then pass selectId to entity updaters:
patchState(store, setAllEntities(items, { selectId: (item) => item.dateFormatted }));

// Or use entityConfig to define it once:
import { entityConfig } from '@ngrx/signals/entities';
const forecastConfig = entityConfig({
  entity: type<WeatherForecast>(),
  selectId: (f) => f.dateFormatted,
});
withEntities(forecastConfig);
// updaters now use it automatically:
patchState(store, setAllEntities(items, forecastConfig));
```

### Named collections (multiple entity types in one store)

```typescript
withEntities({ entity: type<User>(), collection: 'users' });
withEntities({ entity: type<Post>(), collection: 'posts' });
// Gives: usersEntities, usersEntityMap, usersIds
//        postsEntities, postsEntityMap, postsIds
// Updaters: setAllEntities(items, { collection: 'users' })
```

### Full entity updater reference

| Updater                                                 | Purpose                     |
| ------------------------------------------------------- | --------------------------- |
| `addEntity(e)` / `addEntities(es)`                      | Add (skip if ID exists)     |
| `prependEntity(e)` / `prependEntities(es)`              | Add to front                |
| `setEntity(e)` / `setEntities(es)`                      | Add or replace              |
| `setAllEntities(es)`                                    | Replace entire collection   |
| `updateEntity({ id, changes })` / `updateEntities(...)` | Partial update              |
| `updateAllEntities(changes)`                            | Update every entity         |
| `upsertEntity(e)` / `upsertEntities(es)`                | Merge if exists, add if not |
| `removeEntity(id)` / `removeEntities(ids)`              | Remove by ID                |
| `removeAllEntities()`                                   | Clear collection            |

---

## 3. Event-driven store

Use when you want explicit Redux-style events with a reducer (e.g. a counter, form steps, wizard).

```typescript
import { patchState, signalStore, signalStoreFeature, withMethods, withState, type } from '@ngrx/signals';
import { signalMethod } from '@ngrx/signals';
import { eventGroup, on, withReducer } from '@ngrx/signals/events';

export type CounterState = { count: number };
export const counterInitialState: CounterState = { count: 0 };

export const counterEvents = eventGroup({
  source: 'Counter',
  events: {
    increment: type<void>(),
    decrement: type<void>(),
    setCount: type<number>(),
  },
});

export function withCounterFeature() {
  return signalStoreFeature(
    withState(counterInitialState),
    withMethods((store) => ({
      // signalMethod for reacting to a signal input:
      inputCount: signalMethod<number | string>((value) => {
        if (!isNaN(+value)) patchState(store, { count: +value });
      }),
    })),
  );
}

export function withCounterReducer() {
  return signalStoreFeature(
    { state: type<CounterState>() },
    withReducer(
      on(counterEvents.increment, () => ({ count: store.count() + 1 })),
      on(counterEvents.decrement, () => ({ count: store.count() - 1 })),
      on(counterEvents.setCount, ({ payload }) => ({ count: payload })),
    ),
  );
}

export const CounterStore = signalStore(withCounterFeature(), withCounterReducer());

export type CounterStore = InstanceType<typeof CounterStore>;
```

---

## Step 1 – Decide where the store lives

```
libs/<feature>/src/lib/state/<feature>.store.ts
libs/<feature>/src/lib/state/<feature>.store.spec.ts
```

Export from the library's barrel if one exists (`index.ts` / `public-api.ts`).

**Singleton vs scoped:**

- Add `{ providedIn: 'root' }` as the first arg to `signalStore()` for app-wide singletons (auth, layout).
- For component-scoped stores, add the store to the component's `providers` array — do **not** use `providedIn: 'root'`.

---

## Step 2 – Write the spec file

```typescript
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { injectDispatch } from '@ngrx/signals/events';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { myInitialState, MyStore } from './my.store';

describe('MyStore', () => {
  let store: MyStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyStore, provideHttpClientTesting()],
    });
    store = TestBed.inject(MyStore);
  });

  it('should create', () => expect(store).toBeTruthy());

  it('should update state directly', () => {
    patchState(unprotected(store), { query: 'hello' });
    expect(store.query()).toBe('hello');
  });

  it('should handle an event via reducer', () => {
    const dispatch = TestBed.runInInjectionContext(() => injectDispatch(myEvents));
    dispatch.someEvent(42);
    TestBed.flushEffects();
    expect(store.someValue()).toBe(42);
  });
});
```

**Key testing utilities:**

- `unprotected(store)` — unwraps a protected store for direct `patchState` in tests
- `TestBed.flushEffects()` — flush pending `signalMethod` / event reducer effects
- `injectDispatch(eventGroup)` — dispatch typed events in tests

---

## Step 3 – Run tests

```bash
nx test <project-name>
```

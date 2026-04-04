---
name: create-signalstore
description: >
  Create a new NgRx SignalStore following the patterns used in this codebase.
  Use when asked to add a new store, state slice, or signal-based state
  container. Produces feature functions first, combines them in signalStore(),
  and adds a spec file.
---

# Create a NgRx SignalStore

Follow these steps in order.

## Core patterns in this codebase

- **Features first, store second.** Break state into `withXxxFeature()` functions
  using `signalStoreFeature()`, then combine them in a final `signalStore()` call.
- **`rxMethod`** (from `@ngrx/signals/rxjs-interop`) for any RxJS-based side
  effects (HTTP calls, router events, etc.). Never subscribe manually.
- **`signalMethod`** (from `@ngrx/signals`) to react to signal changes inside
  a store or component. Prefer over `effect()`.
- **`withLoadingFeature()`** from `@myorg/shared` whenever a feature performs
  async work (gives you `loading` and `error` state for free).
- **`withEntities`** from `@ngrx/signals/entities` for entity collections.
- **`withProps`** to inject services and expose them to downstream `withMethods`.
- **`withHooks`** (often in its own `withXxxHooks()` feature) for `onInit`/
  `onDestroy` lifecycle logic.
- **`withReducer` + `eventGroup`** from `@ngrx/signals/events` when you want
  Redux-style event dispatching (see counter store).
- Export both the class and its instance type:
  `export type XxxStore = InstanceType<typeof XxxStore>;`

---

## Step 1 – Decide where the store lives

Stores belong in the `state/` folder of their library:

```
libs/<feature>/src/lib/state/<feature>.store.ts
libs/<feature>/src/lib/state/<feature>.store.spec.ts
```

Export from the library's barrel if one exists (`index.ts` / `public-api.ts`).

---

## Step 2 – Write the store file

Use the template below and remove any sections that don't apply.

```typescript
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, signalStoreFeature, withComputed, withHooks, withMethods, withProps, withState, type } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
// Only include if using entities:
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
// Only include if using loading/error state:
import { withLoadingFeature } from '@myorg/shared';

import { MyModel } from '../models/my-model';
import { MyService } from '../services/my.service';

// ── State type & initial value ────────────────────────────────────────────────

export type MyState = {
  selectedId: string | null;
};

export const myInitialState: MyState = {
  selectedId: null,
};

// ── Feature function(s) ───────────────────────────────────────────────────────

export function withMyFeature() {
  return signalStoreFeature(
    withLoadingFeature(), // remove if no async work
    withEntities<MyModel>(), // remove if not an entity list
    withState(myInitialState),
    withProps(() => ({
      myService: inject(MyService),
    })),
    withComputed(({ selectedId, entities }) => ({
      selectedItem: computed(() => entities().find((e) => e.id === selectedId())),
    })),
    withMethods(({ myService, ...store }) => ({
      selectItem(id: string) {
        patchState(store, { selectedId: id });
      },
      loadAll: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            myService.getAll().pipe(
              tapResponse({
                next: (items) => {
                  patchState(store, setAllEntities(items));
                  patchState(store, { loading: false });
                },
                error: (error) => {
                  patchState(store, { error, loading: false });
                },
              }),
            ),
          ),
        ),
      ),
    })),
  );
}

// ── Hooks feature (onInit / onDestroy) ────────────────────────────────────────

export function withMyHooks() {
  return signalStoreFeature(
    { methods: type<{ loadAll: ReturnType<typeof rxMethod<void>> }>() },
    withHooks({
      onInit({ loadAll }) {
        loadAll();
      },
    }),
  );
}

// ── Final store ───────────────────────────────────────────────────────────────

export const MyStore = signalStore(
  // { providedIn: 'root' },  ← add if this should be a singleton
  withMyFeature(),
  withMyHooks(),
);

export type MyStore = InstanceType<typeof MyStore>;
```

### Notes

- **Singleton stores** (app-wide state like auth, layout) add
  `{ providedIn: 'root' }` as the first argument to `signalStore()`.
- **Feature stores** (scoped to a route/component) are provided in the
  component's `providers` array and do _not_ use `providedIn: 'root'`.
- Chain multiple `withComputed` / `withMethods` blocks when a later block
  needs to read values produced by an earlier one.
- Use `withFeature(({ someSignal }) => anotherFeature(someSignal))` to pass
  runtime values from one feature into another (see weather-forecast store).

---

## Step 3 – Write the spec file

```typescript
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { myInitialState, MyStore } from './my.store';

describe('MyStore', () => {
  let store: MyStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyStore,
        provideHttpClientTesting(),
        // add any other deps here
      ],
    });
    store = TestBed.inject(MyStore);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should select an item', () => {
    patchState(unprotected(store), { selectedId: 'abc' });
    expect(store.selectedId()).toBe('abc');
  });

  // Add more cases: loading state, error state, computed values, etc.
});
```

Key testing utilities:

- **`unprotected(store)`** — unwraps a protected store so you can call
  `patchState` on it directly in tests.
- **`TestBed.flushEffects()`** — flush pending `signalMethod` / `rxMethod`
  effects after dispatching events.
- **`injectDispatch(eventGroup)`** from `@ngrx/signals/events` — dispatch
  typed events in tests when using `withReducer`.

---

## Step 4 – Run tests

```bash
nx test <project-name>
```

All tests must pass before committing.

---

## Step 5 – Follow the GitHub workflow

```bash
# 1. Create issue (as chrisjwalk)
gh issue create --title "feat: add MyStore" --body "..."

# 2. Branch
git checkout -b feat/my-store-<issue-number>

# 3. Commit
git add -A
git commit -m "feat: add MyStore (closes #<issue-number>)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 4. Push & PR (as chrisjwalk-bot)
gh auth switch --user chrisjwalk-bot
git push origin feat/my-store-<issue-number>
gh pr create --title "feat: add MyStore" --body "Closes #<issue-number>"

# 5. Switch back
gh auth switch --user chrisjwalk
```

---

## Quick reference – common patterns

### Entity store with filter

```typescript
export function withMyEntityFeature() {
  return signalStoreFeature(
    withLoadingFeature(),
    withEntities<MyModel>(),
    withState({ filter: '' }),
    withComputed(({ entities, filter }) => ({
      filtered: computed(() => entities().filter((e) => e.name.includes(filter()))),
    })),
    withMethods((store, svc = inject(MyService)) => ({
      setFilter(filter: string) {
        patchState(store, { filter });
      },
      load: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            svc.getAll().pipe(
              tapResponse({
                next: (items) => patchState(store, setAllEntities(items), { loading: false }),
                error: (error) => patchState(store, { error, loading: false }),
              }),
            ),
          ),
        ),
      ),
    })),
  );
}
```

### Event-driven store (counter pattern)

```typescript
import { eventGroup, on, withReducer } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';

export const myEvents = eventGroup({
  source: 'My Feature',
  events: {
    setName: type<string>(),
    reset: type<void>(),
  },
});

export function withMyReducer() {
  return signalStoreFeature(
    { state: type<MyState>() },
    withReducer(
      on(myEvents.setName, ({ payload }) => ({ name: payload })),
      on(myEvents.reset, () => myInitialState),
    ),
  );
}
```

### Injecting a store into a component

```typescript
@Component({
  providers: [MyStore], // ← scoped to this component tree
})
export class MyComponent {
  readonly store = inject(MyStore);
}
```

For a singleton store (`providedIn: 'root'`), just inject it — no need to add
it to `providers`.

---
name: recipes
description: >
  Dispatch to the repo's recipe catalog (docs/recipes/) — map a task to the
  recipe(s) that document the pattern, read them plus their canonical
  implementation files, and follow their conventions and gotchas. Use whenever
  the user wants to implement, extend, replicate, or explain a pattern this
  repo already demonstrates.
---

# Recipes

Use when the user asks to add, change, or explain something that matches a
pattern in this repo. Each recipe is a short pointer: `canonical:` frontmatter
lists the source files, and "Conventions & gotchas" encodes the real failures
this repo hit. The **code is the source of truth** — when code and recipe
disagree, trust the code and fix the recipe.

## Step 1 – Map the ask to a recipe

If the user names one (e.g. `/recipes signal-forms`), read that file directly.
Otherwise read `docs/README.md` (the catalog table) and match:

| Ask                                       | Recipe(s)                                                    |
| ----------------------------------------- | ------------------------------------------------------------ |
| New page-level feature (lib, routes, nav) | feature-library, signal-store, server-crud, testing          |
| Scaffolding a feature end-to-end          | use the `create-feature` skill (it references these recipes) |
| Forms / validation                        | signal-forms                                                 |
| Auth: login, refresh, gating routes       | auth-jwt, auth-guards, http-interceptors                     |
| Reactive state / data fetching            | signal-store, weather-forecast (entities, httpResource)      |
| .NET endpoints / database                 | minimal-api-ef, ef-migrations                                |
| Errors, toasts, notifications             | error-handling, notifications                                |
| Unit / integration / e2e tests            | testing                                                      |
| Markdown pages served by the app          | analog-content                                               |
| Service worker / offline                  | pwa                                                          |
| Styling / Material theme tokens           | theming                                                      |
| Micro-frontends                           | mfe, counter                                                 |
| CI / deployment                           | deployment                                                   |
| Dependency bumps                          | dependency-updates                                           |

## Step 2 – Read the recipe, then the canonical code

1. Read the matched recipe file(s) in full — they are deliberately short.
2. Read every file listed in the recipe's `canonical:` frontmatter. These are
   the reference implementations to mirror (names, structure, idioms).
3. Note the "Conventions & gotchas" — they exist because something real broke
   (e.g. `rxResource.value()` dips to `undefined`, dev/build content-map key
   differences, YAML titles with bare `: `, MFE `@ngrx/signals/events` NG0203).

## Step 3 – Apply the pattern

- Copy the canonical structure, not just the idea: file layout, barrel exports,
  route wiring, store composition, error layering.
- For cross-cutting work, follow each recipe's "Related" links — a CRUD feature
  touches feature-library → signal-store → server-crud → testing.

## Step 4 – Verify and keep the recipe honest

- Verify per the testing recipe: 80 % per-file coverage gate, `nx lint`/`test`/
  `build` for affected projects, e2e for page-level features.
- If the work changes a pattern, update the recipe (bump `updated:`) and any
  `canonical:` links in the same change.

Humans can browse the same catalog in the running app at `/recipes`.

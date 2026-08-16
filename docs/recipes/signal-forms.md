---
title: Signal-based forms (compat API)
area: frontend
canonical: [libs/todo/src/lib/components/todo-form/todo-form.ts, libs/todo/src/lib/components/todo-form/todo-form.spec.ts]
updated: 2026-08-16
---

# Signal-based forms

Angular 22's compat API lets signal validators live inside a classic `FormGroup`: `SignalFormControl` from `@angular/forms/signals/compat` plus signal validators from `@angular/forms/signals`. The todo form is the canonical create form.

## Canonical implementation

`libs/todo/src/lib/components/todo-form/todo-form.ts`:

```ts
readonly form = new FormGroup({
  title: new SignalFormControl('', (s) => {
    required(s, { message: 'Title is required' });
  }),
  description: new SignalFormControl(''),
});
```

Template binds `[formGroup]="form"`; `submit()` guards `form.invalid`, calls `markAllAsTouched()` so `mat-error` shows on first submit, emits trimmed values via `output<CreateTodoRequest>()`, then resets with explicit initial values.

## Conventions & gotchas

- `mat-error` works natively here — the compat control is a real `NgControl`, so Material's error-state bridge applies.
- Reset with the exact initial model: `form.reset({ title: '', description: '' })`, not `form.reset()`.
- The compat API is deprecated for new code — migration to the stable schema-driven `form()` API (no `FormGroup` classes) is tracked in issue #215.
- The stable-API prototype lives in PR #214's branch (`feat/todo-crud-recipes-skills-213`, commit 48f6740) if a starting point helps.

## Related

- [Server-side CRUD](server-crud.md) · [Feature library](feature-library.md)

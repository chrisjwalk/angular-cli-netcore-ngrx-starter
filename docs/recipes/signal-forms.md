---
title: Signal-based forms (stable @angular/forms/signals API)
area: frontend
canonical: [libs/todo/src/lib/components/todo-form/todo-form.ts, libs/todo/src/lib/components/todo-form/todo-form.spec.ts]
updated: 2026-08-15
---

# Signal-based forms

Angular 22.1's stable signal forms are schema-driven: `form(modelSignal, schemaFn, options)` builds a `FieldTree` from a model signal (the model is the source of truth — no `FormGroup` classes, no compat imports). The todo form uses it for create + edit.

## Canonical implementation

`libs/todo/src/lib/components/todo-form/todo-form.ts`:

```ts
private readonly model = signal({ title: '', description: '' });

protected readonly todoForm = form(
  this.model,
  (fields) => {
    required(fields.title, { message: 'Title is required' });
    maxLength(fields.title, 200, { message: '...' });
  },
  {
    submission: {
      action: () => { /* emit create/update; return Promise.resolve(undefined) */ },
      onInvalid: () => this.todoForm().markAsTouched(),
    },
  },
);
```

Template: `<form [formRoot]="todoForm">` (sets `novalidate`, handles submit), `<input matInput [formField]="todoForm.title">`, and `todoForm.title().touched() / invalid() / getError('required')` for messages. `ValidationSuccess` is `null | undefined | void`.

## Conventions & gotchas

- `Field` = a callable: `todoForm.title` is a `Field<string>`, `todoForm.title()` is its `FieldState` (`.value` signal, `.valid()`, `.touched()`, `.markAsTouched()`, `.reset()`, `.getError(kind)`).
- No `valueChanges` observable — the equivalent is the `value` signal (`toObservable(field.value)`).
- **Edit mode**: an `effect` watching the `edit` input re-seeds the model signal and calls `reset()` (clears touched/dirty). After create, clear the model + `reset()`.
- `[disabled]="todoForm().invalid()"` on the submit button.
- The compat API (`SignalFormControl` from `@angular/forms/signals/compat`) is deprecated for new code — migrate to `form()`.
- Error display: guard `mat-error` with explicit `@if (touched && invalid)` checks rather than relying on Material's NgControl error-state bridge.

## Related

- [Server-side CRUD](server-crud.md) · [Feature library](feature-library.md)

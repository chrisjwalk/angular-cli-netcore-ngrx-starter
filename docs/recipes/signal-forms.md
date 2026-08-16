---
title: Signal-based forms (stable form() API)
area: frontend
canonical: [libs/todo/src/lib/components/todo-form/todo-form.ts, libs/todo/src/lib/components/todo-form/todo-form.spec.ts]
updated: 2026-08-16
---

# Signal-based forms

Angular 22.1's stable signal forms are schema-driven: `form(modelSignal, schemaFn, options)` builds a field tree from a model signal (the model is the source of truth — no `FormGroup` classes, no compat imports). The todo form uses it for create.

## Canonical implementation

`libs/todo/src/lib/components/todo-form/todo-form.ts`:

```ts
private readonly model = signal({ title: '', description: '' });

protected readonly todoForm = form(
  this.model,
  (fields) => {
    required(fields.title, { message: 'Title is required' });
    maxLength(fields.title, 200, { message: '...' });
    maxLength(fields.description, 1000, { message: '...' });
  },
  {
    submission: {
      action: () => {
        const { title, description } = this.todoForm().value();
        this.create.emit({ title: title.trim(), description: description.trim(), completed: false });
        this.model.set({ title: '', description: '' });
        this.todoForm().reset();
        return Promise.resolve(undefined); // ValidationSuccess
      },
      onInvalid: () => this.todoForm().markAsTouched(),
    },
  },
);
```

Template: `<form [formRoot]="todoForm">` (sets `novalidate`, handles submit), `<input matInput [formField]="todoForm.title">`, and `todoForm.title().touched() / invalid() / getError('required')` for messages.

## Conventions & gotchas

- `Field` = a callable: `todoForm.title` is a `Field<string>`, `todoForm.title()` is its `FieldState` (`.value` signal, `.valid()`, `.touched()`, `.markAsTouched()`, `.reset()`, `.getError(kind)`).
- No `valueChanges` observable — the equivalent is the `value` signal (`toObservable(field.value)`).
- **Reset after create** = set the model back to its initial shape AND call `todoForm().reset()` (clears touched/dirty).
- `[disabled]="todoForm().invalid()"` on the submit button.
- Error display: guard `mat-error` with explicit `@if (touched && invalid)` checks rather than relying on Material's NgControl error-state bridge — signal forms have no NgControl.
- The compat API (`SignalFormControl` from `@angular/forms/signals/compat`) is deprecated for new code.
- An edit-mode variant (seed via `effect`, `update` output) lives in PR #214's branch, commit 48f6740, if a reference is needed.

## Related

- [Server-side CRUD](server-crud.md) · [Feature library](feature-library.md)

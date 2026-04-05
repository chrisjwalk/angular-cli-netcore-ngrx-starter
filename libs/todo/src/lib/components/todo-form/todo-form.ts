import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { required } from '@angular/forms/signals';

import { CreateTodoRequest } from '../../models/todo';

@Component({
  selector: 'lib-todo-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatIcon,
  ],
  template: `
    <form
      class="flex flex-col gap-4 rounded-2xl bg-surface-container p-4 sm:flex-row sm:items-start"
      [formGroup]="form"
      (ngSubmit)="submit()"
    >
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
        class="flex-1"
      >
        <mat-label>Title</mat-label>
        <input
          matInput
          formControlName="title"
          placeholder="What needs to be done?"
          autocomplete="off"
        />
        <mat-error>Title is required</mat-error>
      </mat-form-field>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
        class="flex-1"
      >
        <mat-label>Description</mat-label>
        <input
          matInput
          formControlName="description"
          placeholder="Optional details…"
          autocomplete="off"
        />
      </mat-form-field>
      <button
        mat-flat-button
        type="submit"
        class="h-14 shrink-0"
        [disabled]="form.invalid"
      >
        <mat-icon>add</mat-icon>
        Add
      </button>
    </form>
  `,
  host: {
    class: 'block',
    'data-testid': 'lib-todo-form',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  readonly create = output<CreateTodoRequest>();

  readonly form = new FormGroup({
    title: new SignalFormControl('', (s) => {
      required(s, { message: 'Title is required' });
    }),
    description: new SignalFormControl(''),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.create.emit({
      title: (this.form.value.title ?? '').trim(),
      description: (this.form.value.description ?? '').trim(),
      completed: false,
    });
    this.form.reset({ title: '', description: '' });
  }
}

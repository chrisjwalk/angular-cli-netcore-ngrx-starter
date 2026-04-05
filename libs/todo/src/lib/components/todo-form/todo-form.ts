import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { CreateTodoRequest } from '../../models/todo';

@Component({
  selector: 'lib-todo-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatError,
    MatInput,
    MatButton,
    MatIcon,
  ],
  template: `
    <form
      class="flex flex-col gap-4 sm:flex-row sm:items-end"
      [formGroup]="form"
      (ngSubmit)="submit()"
    >
      <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
        <div class="flex flex-1 flex-col gap-1.5">
          <label
            class="text-xs font-semibold text-on-surface-variant"
            for="todo-title"
          >
            Title
          </label>
          <mat-form-field
            appearance="outline"
            subscriptSizing="dynamic"
            class="w-full"
          >
            <input
              matInput
              id="todo-title"
              formControlName="title"
              placeholder="What needs to be done?"
              autocomplete="off"
            />
            @if (
              form.controls.title.hasError('required') &&
              form.controls.title.touched
            ) {
              <mat-error>Title is required</mat-error>
            }
          </mat-form-field>
        </div>
        <div class="flex flex-1 flex-col gap-1.5">
          <label
            class="text-xs font-semibold text-on-surface-variant"
            for="todo-description"
          >
            Description
          </label>
          <mat-form-field
            appearance="outline"
            subscriptSizing="dynamic"
            class="w-full"
          >
            <input
              matInput
              id="todo-description"
              formControlName="description"
              placeholder="Optional details…"
              autocomplete="off"
            />
          </mat-form-field>
        </div>
      </div>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
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
  create = output<CreateTodoRequest>();

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true }),
  });

  submit() {
    if (this.form.invalid) return;
    this.create.emit({
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
      completed: false,
    });
    this.form.reset();
  }
}

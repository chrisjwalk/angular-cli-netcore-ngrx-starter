import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
    <form class="flex flex-col gap-3" [formGroup]="form" (ngSubmit)="submit()">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Title</mat-label>
          <input
            matInput
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
        <mat-form-field appearance="outline" class="flex-1">
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
      </div>
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

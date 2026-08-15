import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormField,
  FormRoot,
  form,
  maxLength,
  required,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { CreateTodoRequest, Todo, UpdateTodoRequest } from '../../models/todo';

@Component({
  selector: 'lib-todo-form',
  imports: [
    FormRoot,
    FormField,
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
      [formRoot]="todoForm"
    >
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
        class="flex-1"
      >
        <mat-label>Title</mat-label>
        <input
          matInput
          [formField]="todoForm.title"
          placeholder="What needs to be done?"
          autocomplete="off"
        />
        @if (todoForm.title().touched() && todoForm.title().invalid()) {
          <mat-error>
            {{
              todoForm.title().getError('required')
                ? 'Title is required'
                : 'Title must be 200 characters or fewer'
            }}
          </mat-error>
        }
      </mat-form-field>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
        class="flex-1"
      >
        <mat-label>Description</mat-label>
        <input
          matInput
          [formField]="todoForm.description"
          placeholder="Optional details…"
          autocomplete="off"
        />
        @if (
          todoForm.description().touched() && todoForm.description().invalid()
        ) {
          <mat-error>Description must be 1000 characters or fewer</mat-error>
        }
      </mat-form-field>
      @if (edit()) {
        <button
          mat-stroked-button
          type="button"
          class="h-14 shrink-0"
          (click)="cancelEdit.emit()"
        >
          Cancel
        </button>
      }
      <button
        mat-flat-button
        type="submit"
        class="h-14 shrink-0"
        [disabled]="todoForm().invalid()"
      >
        <mat-icon>{{ edit() ? 'save' : 'add' }}</mat-icon>
        {{ edit() ? 'Save' : 'Add' }}
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
  /** The todo being edited; null in create mode. */
  readonly edit = input<Todo | null>(null);
  readonly create = output<CreateTodoRequest>();
  readonly update = output<{ id: string; changes: UpdateTodoRequest }>();
  readonly cancelEdit = output<void>();

  // The model signal is the source of truth for the form — updating it
  // (e.g. from the edit effect) updates the field values.
  private readonly model = signal({ title: '', description: '' });

  protected readonly todoForm = form(
    this.model,
    (fields) => {
      required(fields.title, { message: 'Title is required' });
      maxLength(fields.title, 200, {
        message: 'Title must be 200 characters or fewer',
      });
      maxLength(fields.description, 1000, {
        message: 'Description must be 1000 characters or fewer',
      });
    },
    {
      submission: {
        action: () => {
          const { title, description } = this.todoForm().value();
          const payload = {
            title: title.trim(),
            description: description.trim(),
            completed: this.edit()?.completed ?? false,
          };
          const current = this.edit();
          if (current) {
            this.update.emit({
              id: current.id,
              changes: {
                title: payload.title,
                description: payload.description,
              },
            });
          } else {
            this.create.emit(payload);
            this.model.set({ title: '', description: '' });
            this.todoForm().reset();
          }
          return Promise.resolve(undefined); // ValidationSuccess
        },
        onInvalid: () => this.todoForm().markAsTouched(),
      },
    },
  );

  constructor() {
    // Seed the form whenever the edit target changes (or back to create mode).
    effect(() => {
      const todo = this.edit();
      this.model.set({
        title: todo?.title ?? '',
        description: todo?.description ?? '',
      });
      this.todoForm().reset();
    });
  }
}

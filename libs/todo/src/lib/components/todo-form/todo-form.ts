import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormField, form, required, submit } from '@angular/forms/signals';

import { CreateTodoRequest } from '../../models/todo';

interface TodoModel {
  title: string;
  description: string;
}

@Component({
  selector: 'lib-todo-form',
  imports: [MatButton, MatIcon, FormField],
  template: `
    <form
      class="flex flex-col gap-4 rounded-2xl bg-surface-container p-4 sm:flex-row sm:items-end"
      (submit)="handleSubmit($event)"
    >
      <div class="flex flex-1 flex-col gap-1.5">
        <label
          class="text-xs font-semibold text-on-surface-variant"
          for="todo-title"
        >
          Title
        </label>
        <input
          id="todo-title"
          [formField]="todoForm.title"
          placeholder="What needs to be done?"
          autocomplete="off"
          class="h-14 rounded-lg border bg-surface px-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors focus:ring-2 focus:ring-primary"
          [class.border-outline]="
            !(todoForm.title().touched() && !todoForm.title().valid())
          "
          [class.border-error]="
            todoForm.title().touched() && !todoForm.title().valid()
          "
        />
        @if (todoForm.title().touched() && todoForm.title().errors().length) {
          <p class="text-xs text-error">
            {{ todoForm.title().errors()[0].message }}
          </p>
        }
      </div>
      <div class="flex flex-1 flex-col gap-1.5">
        <label
          class="text-xs font-semibold text-on-surface-variant"
          for="todo-description"
        >
          Description
        </label>
        <input
          id="todo-description"
          [formField]="todoForm.description"
          placeholder="Optional details…"
          autocomplete="off"
          class="h-14 rounded-lg border border-outline bg-surface px-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        mat-flat-button
        type="submit"
        class="h-14 shrink-0"
        [disabled]="!formValid()"
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

  readonly model = signal<TodoModel>({ title: '', description: '' });
  readonly todoForm = form(this.model, (s) => {
    required(s.title, { message: 'Title is required' });
  });
  readonly formValid = computed(() => this.todoForm.title().valid());

  handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    submit(this.todoForm, (value) => {
      this.create.emit({
        title: value.title.trim(),
        description: value.description.trim(),
        completed: false,
      });
      this.model.set({ title: '', description: '' });
    });
  }
}

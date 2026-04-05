import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Todo } from '../../models/todo';

@Component({
  selector: 'lib-todo-list',
  imports: [MatCheckbox, MatIconButton, MatIcon],
  template: `
    @if (loading()) {
      <div class="flex flex-col gap-3">
        @for (_ of [1, 2, 3]; track $index) {
          <div
            class="h-14 rounded-xl bg-surface-container-low animate-pulse"
          ></div>
        }
      </div>
    } @else {
      <ul class="flex flex-col gap-2">
        @for (todo of todos(); track todo.id) {
          <li
            class="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container px-4 py-3 transition-colors hover:bg-surface-container-high"
          >
            <mat-checkbox
              class="mt-0.5 shrink-0"
              [checked]="todo.completed"
              [attr.aria-label]="
                'Mark ' +
                todo.title +
                ' as ' +
                (todo.completed ? 'incomplete' : 'complete')
              "
              (change)="toggled.emit(todo)"
            />
            <div class="flex flex-1 flex-col gap-0.5 overflow-hidden">
              <span
                class="text-sm font-medium leading-snug transition-colors"
                [class.line-through]="todo.completed"
                [class.text-on-surface-variant]="todo.completed"
              >
                {{ todo.title }}
              </span>
              @if (todo.description) {
                <span
                  class="truncate text-xs text-on-surface-variant"
                  [class.line-through]="todo.completed"
                >
                  {{ todo.description }}
                </span>
              }
            </div>
            <button
              mat-icon-button
              class="shrink-0 !text-error"
              [attr.aria-label]="'Delete ' + todo.title"
              (click)="removed.emit(todo.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </li>
        } @empty {
          <li
            class="flex gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4"
          >
            <mat-icon class="mt-0.5 shrink-0 text-on-surface-variant"
              >inbox</mat-icon
            >
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium leading-none text-on-surface">
                No todos yet
              </p>
              <p class="text-sm text-on-surface-variant">
                Add your first todo above to get started.
              </p>
            </div>
          </li>
        }
      </ul>
    }
  `,
  host: {
    class: 'block',
    'data-testid': 'lib-todo-list',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  todos = input<Todo[]>([]);
  loading = input<boolean>(false);
  toggled = output<Todo>();
  removed = output<string>();
}

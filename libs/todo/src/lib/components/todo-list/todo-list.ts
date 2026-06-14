import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { HlmButton, HlmCheckbox } from '@myorg/spartan';
import { Inbox, Trash2, LucideAngularModule } from 'lucide-angular';

import { Todo } from '../../models/todo';

@Component({
  selector: 'lib-todo-list',
  imports: [HlmCheckbox, HlmButton, LucideAngularModule],
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
            <hlm-checkbox
              class="mt-0.5 shrink-0"
              [checked]="todo.completed"
              [attr.aria-label]="
                'Mark ' +
                todo.title +
                ' as ' +
                (todo.completed ? 'incomplete' : 'complete')
              "
              (checkedChange)="toggled.emit(todo)"
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
              hlmButton
              variant="ghost"
              size="icon"
              class="shrink-0 !text-error"
              [attr.aria-label]="'Delete ' + todo.title"
              (click)="removed.emit(todo.id)"
            >
              <lucide-icon [name]="trashIcon" class="h-4 w-4" />
            </button>
          </li>
        } @empty {
          <li class="mx-auto w-full max-w-md">
            <div
              class="flex gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4"
            >
              <lucide-icon
                [name]="inboxIcon"
                class="h-5 w-5 mt-0.5 shrink-0 text-on-surface-variant"
              />
              <div class="flex flex-col gap-1">
                <p class="text-sm font-medium leading-none text-on-surface">
                  No todos yet
                </p>
                <p class="text-sm text-on-surface-variant">
                  Add your first todo above to get started.
                </p>
              </div>
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

  readonly trashIcon = Trash2;
  readonly inboxIcon = Inbox;
}

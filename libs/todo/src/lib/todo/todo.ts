import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TodoStore } from '../state/todo.store';

@Component({
  selector: 'lib-todo',
  template: `
    <ul class="flex flex-col gap-2">
      @for (todo of store.todos.value(); track todo.id) {
        <li class="flex items-center gap-3 p-3 rounded border border-gray-200">
          <input
            type="checkbox"
            class="h-4 w-4 accent-primary cursor-pointer"
            [checked]="todo.completed"
            (change)="store.toggle(todo)"
          />
          <span
            [class.line-through]="todo.completed"
            [class.text-gray-400]="todo.completed"
          >
            {{ todo.title }}
          </span>
        </li>
      } @empty {
        <li class="text-gray-400 text-sm">No todos yet.</li>
      }
    </ul>
  `,
  host: {
    class: 'block',
    'data-testid': 'lib-todo',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TodoStore],
})
export class Todo {
  readonly store = inject(TodoStore);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';
import { TodoStore } from '../../state/todo.store';
import { TodoForm } from '../todo-form/todo-form';
import { TodoList } from '../todo-list/todo-list';

@Component({
  selector: 'lib-todo-page',
  imports: [PageToolbar, PageContainer, TodoForm, TodoList],
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <lib-todo-form class="mb-6" (create)="store.create($event)" />
      <lib-todo-list
        [todos]="store.todos.value() ?? []"
        [loading]="store.todos.isLoading()"
        (toggled)="store.toggle($event)"
        (removed)="store.remove($event)"
      />
    </lib-page-container>
  `,
  host: {
    class: 'flex flex-col min-h-full',
    'data-testid': 'lib-todo-page',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPage {
  readonly layoutStore = inject(LayoutStore);
  readonly store = inject(TodoStore);

  constructor() {
    this.layoutStore.setTitle('Todos');
  }
}

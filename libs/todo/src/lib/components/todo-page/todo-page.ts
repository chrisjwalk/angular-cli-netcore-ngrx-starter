import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';
import { HlmButton } from '@myorg/spartan';
import { AlertCircle, CloudOff, RefreshCw, X, LucideAngularModule } from 'lucide-angular';
import { TodoStore } from '../../state/todo.store';
import { TodoForm } from '../todo-form/todo-form';
import { TodoList } from '../todo-list/todo-list';

@Component({
  selector: 'lib-todo-page',
  imports: [
    PageToolbar,
    PageContainer,
    TodoForm,
    TodoList,
    HlmButton,
    LucideAngularModule,
  ],
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <lib-todo-form class="mb-6" (create)="store.create($event)" />

      @if (store.mutationError()) {
        <div
          class="mb-4 flex items-start gap-3 rounded-xl border border-error bg-error-container p-4"
          role="alert"
        >
          <lucide-icon
            [name]="alertCircleIcon"
            class="h-5 w-5 mt-0.5 shrink-0 text-on-error-container"
          />
          <p class="flex-1 text-sm text-on-error-container">
            {{ store.mutationError() }}
          </p>
          <button
            hlmButton
            variant="ghost"
            size="icon"
            class="!-m-2 shrink-0 !text-on-error-container"
            aria-label="Dismiss error"
            (click)="store.clearMutationError()"
          >
            <lucide-icon [name]="closeIcon" class="h-4 w-4" />
          </button>
        </div>
      }

      @if (store.todos.error()) {
        <div
          class="mx-auto flex w-full max-w-md items-start gap-4 rounded-xl border border-error bg-error-container p-4"
          role="alert"
        >
          <lucide-icon
            [name]="cloudOffIcon"
            class="h-5 w-5 mt-0.5 shrink-0 text-on-error-container"
          />
          <div class="flex flex-1 flex-col gap-1">
            <p class="text-sm font-medium leading-none text-on-error-container">
              Could not load todos
            </p>
            <p class="text-sm text-on-error-container/80">
              The API could not be reached. Check your connection and try again.
            </p>
          </div>
          <button
            hlmButton
            variant="ghost"
            size="icon"
            class="!-m-2 shrink-0 !text-on-error-container"
            aria-label="Retry"
            (click)="store.reload()"
          >
            <lucide-icon [name]="refreshIcon" class="h-4 w-4" />
          </button>
        </div>
      } @else {
        <lib-todo-list
          [todos]="store.todos.value() ?? []"
          [loading]="store.todos.isLoading()"
          (toggled)="store.toggle($event)"
          (removed)="store.remove($event)"
        />
      }
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

  readonly alertCircleIcon = AlertCircle;
  readonly cloudOffIcon = CloudOff;
  readonly refreshIcon = RefreshCw;
  readonly closeIcon = X;

  constructor() {
    this.layoutStore.setTitle('Todos');
  }
}

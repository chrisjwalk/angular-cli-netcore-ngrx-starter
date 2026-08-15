import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';

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
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatPaginator,
  ],
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <lib-todo-form
        class="mb-6"
        [edit]="store.editing()"
        (create)="store.create($event)"
        (update)="store.update($event)"
        (cancelEdit)="store.setEditing(null)"
      />

      @if (store.mutationError()) {
        <div
          class="mb-4 flex items-start gap-3 rounded-xl border border-error bg-error-container p-4"
          role="alert"
        >
          <mat-icon class="mt-0.5 shrink-0 text-on-error-container"
            >error</mat-icon
          >
          <p class="flex-1 text-sm text-on-error-container">
            {{ store.mutationError() }}
          </p>
          <button
            mat-icon-button
            class="!-m-2 shrink-0 !text-on-error-container"
            aria-label="Dismiss error"
            (click)="store.clearMutationError()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }

      <div class="mb-4 flex flex-wrap items-center gap-3">
        <mat-form-field
          appearance="outline"
          subscriptSizing="dynamic"
          class="w-full sm:w-72"
        >
          <mat-label>Filter</mat-label>
          <mat-icon matPrefix class="mr-2 text-on-surface-variant"
            >search</mat-icon
          >
          <input
            matInput
            data-testid="todo-filter"
            [value]="store.filter()"
            placeholder="Filter todos…"
            autocomplete="off"
            (input)="store.updateFilter($any($event.target).value)"
          />
          @if (store.filter()) {
            <button
              matSuffix
              mat-icon-button
              aria-label="Clear filter"
              (click)="store.updateFilter('')"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
        <p class="text-sm text-on-surface-variant" data-testid="todo-count">
          {{ store.totalCount() }} todo{{ store.totalCount() === 1 ? '' : 's' }}
        </p>
      </div>

      @if (store.todos.error()) {
        <div
          class="mx-auto flex w-full max-w-md items-start gap-4 rounded-xl border border-error bg-error-container p-4"
          role="alert"
        >
          <mat-icon class="mt-0.5 shrink-0 text-on-error-container"
            >cloud_off</mat-icon
          >
          <div class="flex flex-1 flex-col gap-1">
            <p class="text-sm font-medium leading-none text-on-error-container">
              Could not load todos
            </p>
            <p class="text-sm text-on-error-container/80">
              The API could not be reached. Check your connection and try again.
            </p>
          </div>
          <button
            mat-icon-button
            class="!-m-2 shrink-0 !text-on-error-container"
            aria-label="Retry"
            (click)="store.reload()"
          >
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      } @else {
        <lib-todo-list
          [todos]="store.items()"
          [loading]="store.todos.isLoading()"
          [activeSort]="{
            sortBy: store.sortBy(),
            sortDir: store.sortDir(),
          }"
          (toggled)="store.toggle($event)"
          (removed)="store.remove($event)"
          (edited)="store.setEditing($event.id)"
          (sorted)="store.setSort($event)"
        />
        @if (store.totalCount() > 0) {
          <mat-paginator
            class="mt-4 rounded-2xl bg-surface-container"
            [length]="store.totalCount()"
            [pageIndex]="store.page() - 1"
            [pageSize]="store.pageSize()"
            [pageSizeOptions]="[5, 10, 25]"
            showFirstLastButtons
            aria-label="Select page of todos"
            (page)="store.setPage($event.pageIndex + 1)"
          />
        }
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

  constructor() {
    this.layoutStore.setTitle('Todos');
  }
}

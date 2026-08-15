import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

import { Todo } from '../../models/todo';

@Component({
  selector: 'lib-todo-list',
  imports: [
    DatePipe,
    MatCheckbox,
    MatIconButton,
    MatIcon,
    MatSort,
    MatSortHeader,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
  ],
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
      <mat-table
        [dataSource]="todos()"
        matSort
        (matSortChange)="sorted.emit($event)"
      >
        <ng-container matColumnDef="title">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by title"
          >
            Title
          </mat-header-cell>
          <mat-cell *matCellDef="let todo" data-testid="todo-title">
            <span [class.line-through]="todo.completed">{{ todo.title }}</span>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="description">
          <mat-header-cell *matHeaderCellDef> Description </mat-header-cell>
          <mat-cell *matCellDef="let todo" data-testid="todo-description">
            <span class="text-on-surface-variant">{{ todo.description }}</span>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="completed">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by completion status"
          >
            Completed
          </mat-header-cell>
          <mat-cell *matCellDef="let todo" class="!pr-0">
            <!-- The projected sr-only label names the checkbox's native input via
                 the label[for] association (the ariaLabel input doesn't render
                 in Material 22.1.x — see the todo e2e spec for regression). -->
            <mat-checkbox
              class="!-ml-3"
              [checked]="todo.completed"
              (change)="toggled.emit(todo)"
            >
              <span class="sr-only">
                Mark {{ todo.title }} as
                {{ todo.completed ? 'incomplete' : 'complete' }}
              </span>
            </mat-checkbox>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="createdAt">
          <mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="Sort by creation date"
          >
            Created
          </mat-header-cell>
          <mat-cell *matCellDef="let todo" data-testid="todo-created">
            {{ todo.createdAt | date: 'MMM d, y' }}
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef></mat-header-cell>
          <mat-cell *matCellDef="let todo" class="!pl-0">
            <button
              mat-icon-button
              [attr.aria-label]="'Edit ' + todo.title"
              (click)="edited.emit(todo)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              class="!text-error"
              [attr.aria-label]="'Delete ' + todo.title"
              (click)="removed.emit(todo.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row
          *matRowDef="let row; columns: displayedColumns"
          data-testid="todo-row"
        ></mat-row>
      </mat-table>
      @if (!todos().length) {
        <div class="mx-auto w-full max-w-md">
          <div
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
          </div>
        </div>
      }
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
  /** Current server-side sort, synced into MatSort so the header arrows stay accurate. */
  activeSort = input<{ sortBy: string; sortDir: 'asc' | 'desc' }>();
  toggled = output<Todo>();
  removed = output<string>();
  edited = output<Todo>();
  sorted = output<Sort>();

  readonly displayedColumns = [
    'title',
    'description',
    'completed',
    'createdAt',
    'actions',
  ];

  private readonly sort = viewChild(MatSort);

  constructor() {
    effect(() => {
      const sort = this.sort();
      const active = this.activeSort();
      if (sort && active) {
        sort.sort({
          id: active.sortBy,
          start: active.sortDir,
          disableClear: false,
        });
      }
    });
  }
}

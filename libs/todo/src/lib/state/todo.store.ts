import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';

import {
  CreateTodoRequest,
  Todo,
  TodoQuery,
  TodoSortBy,
  UpdateTodoRequest,
} from '../models/todo';
import { TodoService } from '../services/todo.service';

export type TodoState = {
  page: number;
  pageSize: number;
  sortBy: TodoSortBy;
  sortDir: 'asc' | 'desc';
  filter: string;
  editingId: string | null;
  mutationError: string | null;
};

export const todoInitialState: TodoState = {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDir: 'desc',
  filter: '',
  editingId: null,
  mutationError: null,
};

export function withTodoFeature() {
  return signalStoreFeature(
    withState(todoInitialState),
    withProps(() => ({
      todoService: inject(TodoService),
    })),
    withComputed(({ page, pageSize, sortBy, sortDir, filter }) => ({
      // The rxResource params signal — any change re-runs the stream.
      params: computed<TodoQuery>(() => ({
        page: page(),
        pageSize: pageSize(),
        sortBy: sortBy(),
        sortDir: sortDir(),
        filter: filter(),
      })),
    })),
    withProps(({ todoService, params }) => ({
      todos: rxResource({
        params,
        stream: ({ params }) => todoService.getAll(params),
      }),
    })),
    withComputed(({ todos, editingId }) => ({
      totalCount: computed(() => todos.value()?.totalCount ?? 0),
      items: computed(() => todos.value()?.items ?? []),
      editing: computed(
        () =>
          todos.value()?.items.find((todo) => todo.id === editingId()) ?? null,
      ),
    })),
    withMethods(({ todoService, todos, totalCount, ...store }) => ({
      setPage(page: number) {
        patchState(store, { page });
      },

      setPageSize(pageSize: number) {
        patchState(store, { pageSize, page: 1 });
      },

      setSort(sort: Sort) {
        // MatSortChange emits { active: '', direction: '' } when a sort is
        // cleared — reset to the default (newest first).
        const sortBy = (sort.active || 'createdAt') as TodoSortBy;
        const sortDir = sort.direction === 'asc' ? 'asc' : 'desc';
        patchState(store, { sortBy, sortDir, page: 1 });
      },

      updateFilter: rxMethod<string>((source$) =>
        source$.pipe(
          debounceTime(300),
          tap((filter: string) => patchState(store, { filter, page: 1 })),
        ),
      ),

      setEditing(id: string | null) {
        patchState(store, { editingId: id });
      },

      reload() {
        todos.reload();
      },

      clearMutationError() {
        patchState(store, { mutationError: null });
      },

      create: rxMethod<CreateTodoRequest>(
        pipe(
          switchMap((todo) =>
            todoService.create(todo).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { mutationError: null });
                  todos.reload();
                },
                error: () =>
                  patchState(store, {
                    mutationError: 'Failed to create todo. Please try again.',
                  }),
              }),
            ),
          ),
        ),
      ),

      update: rxMethod<{ id: string; changes: UpdateTodoRequest }>(
        pipe(
          switchMap(({ id, changes }) =>
            todoService.update(id, changes).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { mutationError: null, editingId: null });
                  todos.reload();
                },
                error: () =>
                  patchState(store, {
                    mutationError: 'Failed to update todo. Please try again.',
                  }),
              }),
            ),
          ),
        ),
      ),

      remove: rxMethod<string>(
        pipe(
          switchMap((id) =>
            todoService.remove(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { mutationError: null });
                  // Removing the last item on a page > 1: step back a page
                  // (the params change re-runs the rxResource instead of a
                  // manual reload).
                  const wasLastItemOnPage =
                    store.page() > 1 &&
                    totalCount() === (store.page() - 1) * store.pageSize() + 1;
                  if (wasLastItemOnPage) {
                    patchState(store, { page: store.page() - 1 });
                  } else {
                    todos.reload();
                  }
                },
                error: () =>
                  patchState(store, {
                    mutationError: 'Failed to delete todo. Please try again.',
                  }),
              }),
            ),
          ),
        ),
      ),

      toggle: rxMethod<Todo>(
        pipe(
          switchMap((todo) =>
            todoService.update(todo.id, { completed: !todo.completed }).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { mutationError: null });
                  todos.reload();
                },
                error: () =>
                  patchState(store, {
                    mutationError: 'Failed to update todo. Please try again.',
                  }),
              }),
            ),
          ),
        ),
      ),
    })),
  );
}

export const TodoStore = signalStore(withTodoFeature());

export type TodoStore = InstanceType<typeof TodoStore>;

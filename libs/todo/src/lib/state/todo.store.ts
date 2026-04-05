import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap } from 'rxjs';

import { CreateTodoRequest, Todo, UpdateTodoRequest } from '../models/todo';
import { TodoService } from '../services/todo.service';

export type TodoState = {
  syncEnabled: boolean;
  mutationError: string | null;
};

export const todoInitialState: TodoState = {
  syncEnabled: false,
  mutationError: null,
};

export function withTodoFeature() {
  return signalStoreFeature(
    withState(todoInitialState),
    withProps(() => ({
      todoService: inject(TodoService),
    })),
    withComputed(({ syncEnabled }) => ({
      params: computed(() => ({ syncEnabled: syncEnabled() })),
    })),
    withProps(({ todoService, params }) => ({
      todos: rxResource({
        params,
        stream: ({ params: { syncEnabled } }) =>
          syncEnabled ? todoService.getAll() : of([] as Todo[]),
      }),
    })),
    withMethods(({ todoService, todos, ...store }) => ({
      enableSync() {
        patchState(store, { syncEnabled: true });
      },

      disableSync() {
        patchState(store, { syncEnabled: false });
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

      remove: rxMethod<string>(
        pipe(
          switchMap((id) =>
            todoService.remove(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { mutationError: null });
                  todos.reload();
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

export const TodoStore = signalStore(
  withTodoFeature(),
  withHooks({
    onInit({ enableSync }) {
      enableSync();
    },
  }),
);

export type TodoStore = InstanceType<typeof TodoStore>;

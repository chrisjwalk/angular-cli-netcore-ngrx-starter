import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';
import { TodoStore } from './todo.store';

const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    completed: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Write tests',
    description: 'Cover the todo store',
    completed: true,
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('TodoStore', () => {
  let store: TodoStore;
  let service: TodoService;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoStore, provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(TodoStore);
    service = TestBed.inject(TodoService);
    appRef = TestBed.inject(ApplicationRef);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should have syncEnabled true after onInit hook', () => {
    expect(store.syncEnabled()).toBe(true);
  });

  describe('loading todos', () => {
    it('should load todos when sync is enabled', async () => {
      vi.spyOn(service, 'getAll').mockReturnValue(of(mockTodos));
      store.enableSync();
      await appRef.whenStable();

      expect(store.todos.value()).toEqual(mockTodos);
      expect(store.todos.isLoading()).toBe(false);
      expect(store.todos.error()).toBeFalsy();
    });

    it('should capture loading error', async () => {
      const error = new Error('network error');
      vi.spyOn(service, 'getAll').mockReturnValue(throwError(() => error));
      store.enableSync();
      await appRef.whenStable();

      expect(store.todos.error()).toBeTruthy();
      expect(store.todos.isLoading()).toBe(false);
    });

    it('should return empty list when sync is disabled', async () => {
      vi.spyOn(service, 'getAll').mockReturnValue(of(mockTodos));
      store.disableSync();
      await appRef.whenStable();

      expect(store.todos.value()).toEqual([]);
    });
  });

  describe('create', () => {
    it('should call service.create and reload', async () => {
      vi.spyOn(service, 'getAll').mockReturnValue(of(mockTodos));
      const newTodo: Todo = {
        id: '3',
        title: 'New task',
        description: '',
        completed: false,
        createdAt: '2024-01-03T00:00:00Z',
      };
      const createSpy = vi
        .spyOn(service, 'create')
        .mockReturnValue(of(newTodo));

      store.create({ title: 'New task', description: '', completed: false });
      await appRef.whenStable();

      expect(createSpy).toHaveBeenCalledWith({
        title: 'New task',
        description: '',
        completed: false,
      });
    });
  });

  describe('update', () => {
    it('should call service.update and reload', async () => {
      vi.spyOn(service, 'getAll').mockReturnValue(of(mockTodos));
      const updateSpy = vi
        .spyOn(service, 'update')
        .mockReturnValue(of({ ...mockTodos[0], title: 'Updated' }));

      store.update({ id: '1', changes: { title: 'Updated' } });
      await appRef.whenStable();

      expect(updateSpy).toHaveBeenCalledWith('1', { title: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should call service.remove and reload', async () => {
      vi.spyOn(service, 'getAll').mockReturnValue(of(mockTodos));
      const removeSpy = vi
        .spyOn(service, 'remove')
        .mockReturnValue(of(undefined));

      store.remove('1');
      await appRef.whenStable();

      expect(removeSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('toggle', () => {
    it('should call service.update with flipped completed and reload', async () => {
      vi.spyOn(service, 'getAll').mockReturnValue(of(mockTodos));
      const updateSpy = vi
        .spyOn(service, 'update')
        .mockReturnValue(of({ ...mockTodos[0], completed: true }));

      store.toggle(mockTodos[0]);
      await appRef.whenStable();

      expect(updateSpy).toHaveBeenCalledWith('1', { completed: true });
    });
  });
});

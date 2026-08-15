import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Todo, TodoPage } from '../models/todo';
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

const mockPage: TodoPage = {
  items: mockTodos,
  totalCount: 2,
  page: 1,
  pageSize: 10,
};

describe('TodoStore', () => {
  let store: TodoStore;
  let service: TodoService;
  let getAllSpy: ReturnType<typeof vi.spyOn>;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoStore, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoService);
    // The rxResource fetches as soon as the store is created — spy first.
    getAllSpy = vi.spyOn(service, 'getAll').mockReturnValue(of(mockPage));
    store = TestBed.inject(TodoStore);
    appRef = TestBed.inject(ApplicationRef);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  describe('loading todos', () => {
    it('should load with the default paging/sort params', async () => {
      await appRef.whenStable();

      expect(getAllSpy).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDir: 'desc',
        filter: '',
      });
      expect(store.items()).toEqual(mockTodos);
      expect(store.totalCount()).toBe(2);
      expect(store.todos.isLoading()).toBe(false);
      expect(store.todos.error()).toBeFalsy();
    });

    it('should capture loading error', async () => {
      getAllSpy.mockReturnValue(throwError(() => new Error('network error')));
      store.reload();
      await appRef.whenStable();

      expect(store.todos.error()).toBeTruthy();
      expect(store.todos.isLoading()).toBe(false);
    });
  });

  describe('query state', () => {
    it('should refetch with new params when sorting', async () => {
      await appRef.whenStable();

      store.setSort({ active: 'title', direction: 'asc' });
      await appRef.whenStable();

      expect(getAllSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortBy: 'title', sortDir: 'asc', page: 1 }),
      );
    });

    it('should fall back to defaults when the sort is cleared', async () => {
      await appRef.whenStable();

      store.setSort({ active: '', direction: '' });
      await appRef.whenStable();

      expect(getAllSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortBy: 'createdAt', sortDir: 'desc' }),
      );
    });

    it('should reset to page 1 when the page size changes', async () => {
      await appRef.whenStable();
      store.setPage(3);
      await appRef.whenStable();

      store.setPageSize(5);
      await appRef.whenStable();

      expect(getAllSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, pageSize: 5 }),
      );
    });

    it('should debounce the filter before refetching', async () => {
      await appRef.whenStable();
      store.setPage(2);
      await appRef.whenStable();

      store.updateFilter('buy');
      // Within the 300ms debounce window: no refetch yet.
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(getAllSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, filter: '' }),
      );

      // After the debounce window: refetch with the new filter, back on page 1.
      await new Promise((resolve) => setTimeout(resolve, 200));
      await appRef.whenStable();
      expect(getAllSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ filter: 'buy', page: 1 }),
      );
    });

    it('should expose the todo being edited', async () => {
      await appRef.whenStable();
      expect(store.editing()).toBeNull();

      store.setEditing('2');
      expect(store.editing()?.title).toBe('Write tests');
    });
  });

  describe('create', () => {
    it('should call service.create and reload', async () => {
      await appRef.whenStable();
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
      expect(getAllSpy.mock.calls.length).toBeGreaterThan(1); // refetched
    });
  });

  describe('update', () => {
    it('should call service.update, close editing, and reload', async () => {
      await appRef.whenStable();
      store.setEditing('1');
      const updateSpy = vi
        .spyOn(service, 'update')
        .mockReturnValue(of({ ...mockTodos[0], title: 'Updated' }));

      store.update({ id: '1', changes: { title: 'Updated' } });
      await appRef.whenStable();

      expect(updateSpy).toHaveBeenCalledWith('1', { title: 'Updated' });
      expect(store.editingId()).toBeNull();
    });
  });

  describe('remove', () => {
    it('should call service.remove and reload', async () => {
      await appRef.whenStable();
      const removeSpy = vi
        .spyOn(service, 'remove')
        .mockReturnValue(of(undefined));

      store.remove('1');
      await appRef.whenStable();

      expect(removeSpy).toHaveBeenCalledWith('1');
    });

    it('should step back a page when the last item on a page > 1 is removed', async () => {
      getAllSpy.mockReturnValue(
        of({ items: [mockTodos[0]], totalCount: 11, page: 2, pageSize: 10 }),
      );
      store.setPage(2);
      await appRef.whenStable();
      vi.spyOn(service, 'remove').mockReturnValue(of(undefined));

      store.remove('1');
      await appRef.whenStable();

      expect(getAllSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1 }),
      );
    });
  });

  describe('toggle', () => {
    it('should call service.update with flipped completed and reload', async () => {
      await appRef.whenStable();
      const updateSpy = vi
        .spyOn(service, 'update')
        .mockReturnValue(of({ ...mockTodos[0], completed: true }));

      store.toggle(mockTodos[0]);
      await appRef.whenStable();

      expect(updateSpy).toHaveBeenCalledWith('1', { completed: true });
    });
  });
});

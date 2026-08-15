import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { of } from 'rxjs';

import { TodoPageDto } from '../../models/todo';
import { TodoService } from '../../services/todo.service';
import { TodoStore } from '../../state/todo.store';
import { TodoPage } from './todo-page';

const mockPage: TodoPageDto = {
  items: [
    {
      id: '1',
      title: 'Buy milk',
      description: 'From the store',
      completed: false,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ],
  totalCount: 1,
  page: 1,
  pageSize: 10,
};

describe('TodoPage', () => {
  let getAllSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getAllSpy = vi
      .spyOn(TodoService.prototype, 'getAll')
      .mockReturnValue(of(mockPage));
  });

  const renderPage = () =>
    render(TodoPage, {
      providers: [TodoStore, provideHttpClient(), provideHttpClientTesting()],
    });

  it('should create', async () => {
    await renderPage();
    expect(screen.getByTestId('lib-todo-page')).toBeTruthy();
  });

  it('should render rows, count, and the paginator from the store', async () => {
    await renderPage();
    await screen.findByText('Buy milk');

    expect(screen.getByTestId('todo-count').textContent).toContain('1 todo');
    expect(document.querySelector('mat-paginator')).toBeTruthy();
    expect(getAllSpy).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, pageSize: 10 }),
    );
  });

  it('should debounce the filter input into a refetch', async () => {
    await renderPage();
    await screen.findByText('Buy milk');

    fireEvent.input(screen.getByTestId('todo-filter'), {
      target: { value: 'buy' },
    });

    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(getAllSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ filter: 'buy', page: 1 }),
    );
  });
});

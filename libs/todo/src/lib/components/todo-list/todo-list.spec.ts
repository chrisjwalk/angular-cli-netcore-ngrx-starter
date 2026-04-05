import { render, screen } from '@testing-library/angular';

import { TodoList } from './todo-list';

describe('TodoList', () => {
  it('should create', async () => {
    await render(TodoList);
    expect(screen.getByTestId('lib-todo-list')).toBeTruthy();
  });

  it('should show empty state when no todos', async () => {
    await render(TodoList, { inputs: { todos: [] } });
    expect(screen.getByText(/No todos yet/)).toBeTruthy();
  });

  it('should render todo items', async () => {
    await render(TodoList, {
      inputs: {
        todos: [
          {
            id: '1',
            title: 'Buy milk',
            description: '',
            completed: false,
            createdAt: '',
          },
        ],
      },
    });
    expect(screen.getByText('Buy milk')).toBeTruthy();
  });

  it('should show skeleton when loading', async () => {
    const { container } = await render(TodoList, { inputs: { loading: true } });
    expect(container.querySelectorAll('.animate-pulse').length).toBe(3);
  });
});

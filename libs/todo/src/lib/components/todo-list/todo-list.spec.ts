import { fireEvent, render, screen } from '@testing-library/angular';

import { Todo } from '../../models/todo';
import { TodoList } from './todo-list';

const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Buy milk',
    description: 'From the store',
    completed: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Write tests',
    description: '',
    completed: true,
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('TodoList', () => {
  it('should create', async () => {
    await render(TodoList);
    expect(screen.getByTestId('lib-todo-list')).toBeTruthy();
  });

  it('should show empty state when no todos', async () => {
    await render(TodoList, { inputs: { todos: [] } });
    expect(screen.getByText(/No todos yet/)).toBeTruthy();
  });

  it('should render todo rows', async () => {
    await render(TodoList, { inputs: { todos: mockTodos } });
    expect(screen.getAllByTestId('todo-row')).toHaveLength(2);
    expect(screen.getByText('Buy milk')).toBeTruthy();
  });

  it('should show skeleton when loading', async () => {
    const { container } = await render(TodoList, {
      inputs: { todos: [], loading: true },
    });
    expect(container.querySelectorAll('.animate-pulse').length).toBe(3);
  });

  it('should emit toggled, removed, and edited for row actions', async () => {
    const toggledSpy = vi.fn();
    const removedSpy = vi.fn();
    const editedSpy = vi.fn();
    await render(TodoList, {
      inputs: { todos: mockTodos },
      componentOutputs: {
        toggled: { emit: toggledSpy },
        removed: { emit: removedSpy },
        edited: { emit: editedSpy },
      },
    });

    fireEvent.click(screen.getByLabelText('Mark Buy milk as complete'));
    expect(toggledSpy).toHaveBeenCalledWith(mockTodos[0]);

    fireEvent.click(screen.getByLabelText('Edit Buy milk'));
    expect(editedSpy).toHaveBeenCalledWith(mockTodos[0]);

    fireEvent.click(screen.getByLabelText('Delete Buy milk'));
    expect(removedSpy).toHaveBeenCalledWith('1');
  });

  it('should emit sorted when a sort header is clicked', async () => {
    const sortedSpy = vi.fn();
    await render(TodoList, {
      inputs: { todos: mockTodos },
      componentOutputs: { sorted: { emit: sortedSpy } },
    });

    fireEvent.click(screen.getByText('Title'));

    expect(sortedSpy).toHaveBeenCalledWith(
      expect.objectContaining({ active: 'title', direction: 'asc' }),
    );
  });
});

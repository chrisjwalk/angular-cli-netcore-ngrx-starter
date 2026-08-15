import { fireEvent, render, screen } from '@testing-library/angular';

import { Todo } from '../../models/todo';
import { TodoForm } from './todo-form';

const mockTodo: Todo = {
  id: '1',
  title: 'Buy milk',
  description: 'From the store',
  completed: false,
  createdAt: '2024-01-01T00:00:00Z',
};

describe('TodoForm', () => {
  const submit = (form: Element) => fireEvent.submit(form);
  const formElement = () => {
    const form = screen.getByTestId('lib-todo-form').querySelector('form');
    if (!form) {
      throw new Error('form element not found');
    }
    return form;
  };
  const titleInput = () =>
    screen.getByPlaceholderText('What needs to be done?');

  it('should create', async () => {
    await render(TodoForm);
    expect(screen.getByTestId('lib-todo-form')).toBeTruthy();
  });

  it('should render title and description inputs', async () => {
    await render(TodoForm);
    expect(titleInput()).toBeTruthy();
    expect(screen.getByPlaceholderText('Optional details…')).toBeTruthy();
  });

  it('should emit create with trimmed values on submit', async () => {
    const createSpy = vi.fn();
    await render(TodoForm, {
      componentOutputs: { create: { emit: createSpy } },
    });

    fireEvent.input(titleInput(), { target: { value: '  New task  ' } });
    submit(formElement());

    expect(createSpy).toHaveBeenCalledWith({
      title: 'New task',
      description: '',
      completed: false,
    });
  });

  it('should not submit when the title is empty and show the error', async () => {
    const createSpy = vi.fn();
    await render(TodoForm, {
      componentOutputs: { create: { emit: createSpy } },
    });

    submit(formElement());

    expect(createSpy).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeTruthy();
  });

  it('should prefill from the edit input and emit update on submit', async () => {
    const updateSpy = vi.fn();
    await render(TodoForm, {
      inputs: { edit: mockTodo },
      componentOutputs: { update: { emit: updateSpy } },
    });

    expect((titleInput() as HTMLInputElement).value).toBe('Buy milk');
    expect(
      (screen.getByPlaceholderText('Optional details…') as HTMLInputElement)
        .value,
    ).toBe('From the store');

    fireEvent.input(titleInput(), { target: { value: 'Updated title' } });
    submit(formElement());

    expect(updateSpy).toHaveBeenCalledWith({
      id: '1',
      changes: { title: 'Updated title', description: 'From the store' },
    });
  });

  it('should emit cancelEdit when cancel is clicked in edit mode', async () => {
    const cancelSpy = vi.fn();
    await render(TodoForm, {
      inputs: { edit: mockTodo },
      componentOutputs: { cancelEdit: { emit: cancelSpy } },
    });

    fireEvent.click(screen.getByText('Cancel'));

    expect(cancelSpy).toHaveBeenCalled();
  });
});

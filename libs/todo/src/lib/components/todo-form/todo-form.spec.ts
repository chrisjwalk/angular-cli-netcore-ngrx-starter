import { fireEvent, render, screen } from '@testing-library/angular';

import { TodoForm } from './todo-form';

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

  it('should reset the form after a successful create', async () => {
    const createSpy = vi.fn();
    await render(TodoForm, {
      componentOutputs: { create: { emit: createSpy } },
    });

    fireEvent.input(titleInput(), { target: { value: 'First task' } });
    submit(formElement());

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect((titleInput() as HTMLInputElement).value).toBe('');
    expect(
      (screen.getByPlaceholderText('Optional details…') as HTMLInputElement)
        .value,
    ).toBe('');
  });
});

import { render, screen } from '@testing-library/angular';

import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  it('should create', async () => {
    await render(TodoForm);
    expect(screen.getByTestId('lib-todo-form')).toBeTruthy();
  });

  it('should render title and description inputs', async () => {
    await render(TodoForm);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeTruthy();
    expect(screen.getByPlaceholderText('Optional details…')).toBeTruthy();
  });
});

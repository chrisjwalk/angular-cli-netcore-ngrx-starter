import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';

import { TodoStore } from '../../state/todo.store';
import { TodoPage } from './todo-page';

describe('TodoPage', () => {
  it('should create', async () => {
    await render(TodoPage, {
      providers: [TodoStore, provideHttpClient(), provideHttpClientTesting()],
    });
    expect(screen.getByTestId('lib-todo-page')).toBeTruthy();
  });
});

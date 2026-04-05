import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';

import { Todo } from './todo';

describe('Todo', () => {
  it('should create', async () => {
    await render(Todo, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(screen.getByTestId('lib-todo')).toBeTruthy();
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { provideMarkdown } from 'ngx-markdown';

import { Home } from './home';

describe('Home', () => {
  test('should exist', async () => {
    await render(Home, {
      providers: [
        provideMarkdown(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByTestId('lib-home')).toBeTruthy();
  });
});

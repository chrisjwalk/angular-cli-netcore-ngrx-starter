import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { provideMarkdown } from 'ngx-markdown';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  test('should exist', async () => {
    await render(HomeComponent, {
      providers: [
        provideMarkdown(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByTestId('lib-home')).toBeTruthy();
  });
});

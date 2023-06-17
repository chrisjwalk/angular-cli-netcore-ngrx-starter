import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { MarkdownModule } from 'ngx-markdown';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  test('should exist', async () => {
    await render(HomeComponent, {
      providers: [
        importProvidersFrom(MarkdownModule.forRoot()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByTestId('lib-home')).toBeTruthy();
  });
});

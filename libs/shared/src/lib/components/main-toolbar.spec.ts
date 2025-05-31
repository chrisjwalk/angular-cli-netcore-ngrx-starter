import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { MainToolbar } from './main-toolbar';

describe('MainToolbar', () => {
  it('should create', async () => {
    await render(MainToolbar, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(screen.getByTestId('lib-main-toolbar')).toBeTruthy();
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  it('should create', async () => {
    await render(MainToolbarComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(screen.getByTestId('lib-main-toolbar')).toBeTruthy();
  });
});

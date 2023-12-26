import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { render, screen } from '@testing-library/angular';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  test('should exist', async () => {
    await render(AppComponent, {
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        provideLocationMocks(),
        provideNoopAnimations(),
        provideServiceWorker('/ngsw-worker.js', {
          enabled: false,
        }),
      ],
    });

    expect(screen.getByTestId('app-root')).toBeTruthy();
  });
});

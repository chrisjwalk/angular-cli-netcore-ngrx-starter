import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { render, screen } from '@testing-library/angular';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  test('should exist', async () => {
    await render(AppComponent, {
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {
          enabled: false,
        }),
      ],
      providers: [],
    });

    expect(screen.getByTestId('app-root')).toBeTruthy();
  });
});

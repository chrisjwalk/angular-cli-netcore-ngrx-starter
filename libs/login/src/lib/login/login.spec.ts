import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render } from '@testing-library/angular';

import { Login } from './login';

describe('Login', () => {
  it('should create', async () => {
    const { fixture } = await render(Login, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(fixture.componentInstance).toBeTruthy();
  });
});

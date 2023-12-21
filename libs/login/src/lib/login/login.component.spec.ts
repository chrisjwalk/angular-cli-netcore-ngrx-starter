import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render } from '@testing-library/angular';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  it('should create', async () => {
    const { fixture } = await render(LoginComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(fixture.componentInstance).toBeTruthy();
  });
});

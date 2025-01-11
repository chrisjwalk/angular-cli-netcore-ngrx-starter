import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render } from '@testing-library/angular';
import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  it('should create', async () => {
    const { fixture } = await render(MainToolbarComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(fixture.componentInstance).toBeTruthy();
  });
});

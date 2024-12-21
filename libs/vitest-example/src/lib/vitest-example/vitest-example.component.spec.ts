import { render } from '@testing-library/angular';
import { VitestExampleComponent } from './vitest-example.component';

describe('VitestExampleComponent', () => {
  it('should create', async () => {
    const { fixture } = await render(VitestExampleComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });
});

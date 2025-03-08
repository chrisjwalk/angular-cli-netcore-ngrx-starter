import { render, screen } from '@testing-library/angular';
import { PageContainerComponent } from './page-container.component';

describe('PageContainerComponent', () => {
  it('should create', async () => {
    await render(PageContainerComponent);

    expect(screen.getByTestId('lib-page-container')).toBeTruthy();
  });
});

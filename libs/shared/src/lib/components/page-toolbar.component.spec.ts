import { render, screen } from '@testing-library/angular';
import { PageToolbarComponent } from './page-toolbar.component';

describe('PageToolbarComponent', () => {
  it('should create', async () => {
    await render(PageToolbarComponent);
    expect(screen.getByTestId('lib-page-toolbar')).toBeTruthy();
  });
});

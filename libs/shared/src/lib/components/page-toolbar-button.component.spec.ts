import { render, screen } from '@testing-library/angular';
import { PageToolbarButtonComponent } from './page-toolbar-button.component';

describe('PageToolbarButtonComponent', () => {
  it('should create', async () => {
    await render(PageToolbarButtonComponent);
    expect(screen.getByTestId('lib-page-toolbar-button')).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/angular';
import { PageToolbarButton } from './page-toolbar-button';

describe('PageToolbarButton', () => {
  it('should create', async () => {
    await render(PageToolbarButton);
    expect(screen.getByTestId('lib-page-toolbar-button')).toBeTruthy();
  });
});

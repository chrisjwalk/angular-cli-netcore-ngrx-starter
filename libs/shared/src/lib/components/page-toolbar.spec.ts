import { render, screen } from '@testing-library/angular';
import { PageToolbar } from './page-toolbar';

describe('PageToolbar', () => {
  it('should create', async () => {
    await render(PageToolbar);
    expect(screen.getByTestId('lib-page-toolbar')).toBeTruthy();
  });
});

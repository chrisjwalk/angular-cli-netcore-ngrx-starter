import { render, screen } from '@testing-library/angular';
import { PageContainer } from './page-container';

describe('PageContainer', () => {
  it('should create', async () => {
    await render(PageContainer);

    expect(screen.getByTestId('lib-page-container')).toBeTruthy();
  });
});

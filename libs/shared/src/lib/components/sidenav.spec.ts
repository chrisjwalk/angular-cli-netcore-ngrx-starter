import { render, screen } from '@testing-library/angular';
import { Sidenav } from './sidenav';

describe('Sidenav', () => {
  it('should create', async () => {
    await render(Sidenav);

    expect(screen.getByTestId('lib-sidenav')).toBeTruthy();
  });
});

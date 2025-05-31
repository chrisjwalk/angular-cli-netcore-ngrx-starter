import { render, screen } from '@testing-library/angular';
import { SidenavListItem } from './sidenav-list-item';

describe('SidenavListItem', () => {
  it('should create', async () => {
    await render(SidenavListItem);
    expect(screen.getByTestId('lib-sidenav-list-item')).toBeTruthy();
  });
});

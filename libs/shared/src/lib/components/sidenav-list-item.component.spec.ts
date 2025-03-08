import { render, screen } from '@testing-library/angular';
import { SidenavListItemComponent } from './sidenav-list-item.component';

describe('SidenavListItemComponent', () => {
  it('should create', async () => {
    await render(SidenavListItemComponent);
    expect(screen.getByTestId('lib-sidenav-list-item')).toBeTruthy();
  });
});

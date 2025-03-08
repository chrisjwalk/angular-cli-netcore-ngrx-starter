import { render, screen } from '@testing-library/angular';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  it('should create', async () => {
    await render(SidenavComponent);

    expect(screen.getByTestId('lib-sidenav')).toBeTruthy();
  });
});

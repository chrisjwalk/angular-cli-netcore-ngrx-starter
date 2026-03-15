import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { fireEvent, render, screen } from '@testing-library/angular';
import { NotificationStore } from '../state/notification.store';
import { NotificationBell } from './notification-bell';

async function setup() {
  const { fixture } = await render(NotificationBell, {
    providers: [provideNoopAnimations(), NotificationStore],
  });
  const component = fixture.debugElement.componentInstance as NotificationBell;
  return { fixture, component };
}

describe('NotificationBell', () => {
  it('should render the bell button', async () => {
    await setup();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('should hide badge when there are no unread notifications', async () => {
    await setup();
    const badgeHost = document.querySelector('.mat-badge-hidden');
    expect(badgeHost).toBeTruthy();
  });

  it('should show badge count when there are unread notifications', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(NotificationStore);
    store.add({ kind: 'info', title: 'Test' });
    fixture.detectChanges();
    const badge = document.querySelector('.mat-badge-content');
    expect(badge?.textContent?.trim()).toBe('1');
  });

  it('should call open() when bell is clicked', async () => {
    const { component } = await setup();
    vi.spyOn(component, 'open');
    await fireEvent.click(screen.getByRole('button'));
    expect(component.open).toHaveBeenCalled();
  });

  it('should have aria-label describing unread count', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(NotificationStore);
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'info', title: 'B' });
    fixture.detectChanges();
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('2 unread');
  });
});

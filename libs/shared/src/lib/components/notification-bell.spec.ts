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

  it('should use singular form in aria-label when exactly 1 notification is unread', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(NotificationStore);
    store.add({ kind: 'info', title: 'One' });
    fixture.detectChanges();
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe(
      '1 unread notification',
    );
  });

  it('should open bottom sheet on handset devices', async () => {
    const { fixture } = await setup();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = fixture.debugElement.componentInstance as any;
    const breakpointObserver = fixture.debugElement.injector.get(
      component['breakpointObserver'].constructor,
    );
    vi.spyOn(breakpointObserver, 'isMatched').mockReturnValue(true);
    const bottomSheet = fixture.debugElement.injector.get(
      component['bottomSheet'].constructor,
    );
    vi.spyOn(bottomSheet, 'open').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => null as any,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(bottomSheet.open).toHaveBeenCalled();
  });

  it('should close the overlay when bell is clicked while panel is open', async () => {
    const { component } = await setup();
    fireEvent.click(screen.getByRole('button')); // open
    const markAllReadSpy = vi.spyOn(component.store, 'markAllRead');
    fireEvent.click(screen.getByRole('button')); // close
    expect(markAllReadSpy).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button')); // re-open — reuses existing overlayRef
  });
});

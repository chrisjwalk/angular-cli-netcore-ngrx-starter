import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { fireEvent, render, screen } from '@testing-library/angular';
import { NotificationStore } from '../state/notification.store';
import { NotificationList } from './notification-list';

describe('NotificationList', () => {
  async function setup() {
    const { fixture } = await render(NotificationList, {
      providers: [provideNoopAnimations(), NotificationStore],
    });
    const store = fixture.debugElement.injector.get(NotificationStore);
    return { fixture, store };
  }

  it('should show empty state when there are no notifications', async () => {
    await setup();
    expect(screen.getByText('No notifications')).toBeTruthy();
  });

  it('should render a notification title', async () => {
    const { store } = await setup();
    store.add({ kind: 'info', title: 'Hello world' });
    expect(await screen.findByText('Hello world')).toBeTruthy();
  });

  it('should render notification detail when provided', async () => {
    const { store } = await setup();
    store.add({ kind: 'info', title: 'Title', detail: 'Some detail text' });
    expect(await screen.findByText('Some detail text')).toBeTruthy();
  });

  it('should render action button when action is provided', async () => {
    const { store } = await setup();
    store.add({
      kind: 'sw-update',
      title: 'Update',
      action: { label: 'Reload', handler: vi.fn() },
    });
    expect(await screen.findByRole('button', { name: 'Reload' })).toBeTruthy();
  });

  it('should call action handler and mark notification read when action clicked', async () => {
    const { store } = await setup();
    const handler = vi.fn();
    store.add({
      kind: 'sw-update',
      title: 'Update',
      action: { label: 'Reload', handler },
    });
    const id = store.notifications()[0].id;

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Reload' }),
    );

    expect(handler).toHaveBeenCalled();
    expect(store.notifications().find((n) => n.id === id)?.read).toBe(true);
  });

  it('should dismiss notification when close button is clicked', async () => {
    const { store } = await setup();
    store.add({ kind: 'info', title: 'Dismiss me' });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Dismiss: Dismiss me' }),
    );

    expect(store.notifications()).toHaveLength(0);
    expect(screen.getByText('No notifications')).toBeTruthy();
  });

  it('should show mark-all-read button when there are unread notifications', async () => {
    const { store } = await setup();
    store.add({ kind: 'info', title: 'Unread' });
    expect(
      await screen.findByRole('button', { name: /mark all read/i }),
    ).toBeTruthy();
  });

  it('should mark all notifications read when mark-all-read is clicked', async () => {
    const { store } = await setup();
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'info', title: 'B' });

    await fireEvent.click(
      await screen.findByRole('button', { name: /mark all read/i }),
    );

    expect(store.unreadCount()).toBe(0);
  });

  it('should hide mark-all-read button when all are read', async () => {
    const { store } = await setup();
    store.add({ kind: 'info', title: 'A' });
    store.markAllRead();
    expect(
      screen.queryByRole('button', { name: /mark all read/i }),
    ).toBeFalsy();
  });

  it('should not show unread indicator for already-read notifications', async () => {
    const { store, fixture } = await setup();
    store.add({ kind: 'info', title: 'Read item' });
    store.markRead(store.notifications()[0].id);
    fixture.detectChanges();
    await screen.findByText('Read item');
    expect(document.querySelectorAll('[aria-label="Unread"]')).toHaveLength(0);
  });

  it('iconFor should return notifications icon for unknown kind', async () => {
    const { fixture } = await setup();
    const component = fixture.debugElement
      .componentInstance as NotificationList;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(component.iconFor('unknown' as any)).toBe('notifications');
  });
});

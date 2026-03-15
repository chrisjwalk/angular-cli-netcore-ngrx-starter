import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationStore } from '@myorg/shared';
import { fireEvent, render, screen } from '@testing-library/angular';

import { Debug } from './debug';

async function setup() {
  const { fixture } = await render(Debug, {
    providers: [provideNoopAnimations(), NotificationStore],
  });
  const store = fixture.componentInstance.store;
  return { store };
}

describe('Debug', () => {
  it('should render debug tools heading', async () => {
    await setup();
    expect(screen.getByText(/debug tools/i)).toBeTruthy();
  });

  it('addInfo should add an info notification', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add info'));
    expect(store.notifications().length).toBe(1);
    expect(store.notifications()[0].kind).toBe('info');
  });

  it('addError should add an error notification', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add error'));
    expect(store.notifications()[0].kind).toBe('error');
  });

  it('addAuth should add an auth notification', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add auth'));
    expect(store.notifications()[0].kind).toBe('auth');
  });

  it('addSwUpdate should add a sw-update notification with reload action', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add sw-update'));
    const notification = store.notifications()[0];
    expect(notification.kind).toBe('sw-update');
    expect(notification.action?.label).toBe('Reload');
  });

  it('addWithAction should add a notification with an action', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add with action'));
    expect(store.notifications()[0].action?.label).toBe('Do it');
  });

  it('addAutoDismiss should add a notification with autoDismissMs', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add auto-dismiss (3s)'));
    expect(store.notifications()[0].autoDismissMs).toBe(3000);
  });

  it('clearAll should dismiss all notifications', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add info'));
    fireEvent.click(screen.getByText('Add error'));
    expect(store.notifications().length).toBe(2);
    fireEvent.click(screen.getByText('Clear all'));
    expect(store.notifications().length).toBe(0);
  });

  it('mark all read should mark all notifications as read', async () => {
    const { store } = await setup();
    fireEvent.click(screen.getByText('Add info'));
    fireEvent.click(screen.getByText('Add error'));
    expect(store.unreadCount()).toBe(2);
    fireEvent.click(screen.getByText('Mark all read'));
    expect(store.unreadCount()).toBe(0);
  });
});

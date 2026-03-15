import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { NotificationStore } from './notification.store';

describe('NotificationStore', () => {
  let store: InstanceType<typeof NotificationStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NotificationStore] });
    store = TestBed.inject(NotificationStore);
  });

  it('should start with no notifications', () => {
    expect(store.notifications()).toEqual([]);
    expect(store.unreadCount()).toBe(0);
  });

  it('should add a notification', () => {
    store.add({ kind: 'info', title: 'Hello', read: false });
    expect(store.notifications()).toHaveLength(1);
    expect(store.notifications()[0]).toMatchObject({
      kind: 'info',
      title: 'Hello',
      read: false,
    });
  });

  it('should assign a unique id and createdAt on add', () => {
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'info', title: 'B' });
    const [a, b] = store.notifications();
    expect(a.id).toBeTruthy();
    expect(b.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).toBeInstanceOf(Date);
  });

  it('should increment unreadCount for each new notification', () => {
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'error', title: 'B' });
    expect(store.unreadCount()).toBe(2);
  });

  it('should mark a single notification as read', () => {
    store.add({ kind: 'info', title: 'A' });
    const id = store.notifications()[0].id;
    store.markRead(id);
    expect(store.notifications()[0].read).toBe(true);
    expect(store.unreadCount()).toBe(0);
  });

  it('should only mark the targeted notification as read (not others)', () => {
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'info', title: 'B' });
    const idA = store.notifications()[0].id;
    store.markRead(idA);
    expect(store.notifications()[0].read).toBe(true);
    expect(store.notifications()[1].read).toBe(false);
    expect(store.unreadCount()).toBe(1);
  });

  it('should mark all notifications as read', () => {
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'error', title: 'B' });
    store.markAllRead();
    expect(store.notifications().every((n) => n.read)).toBe(true);
    expect(store.unreadCount()).toBe(0);
  });

  it('should dismiss a notification by id', () => {
    store.add({ kind: 'info', title: 'A' });
    const id = store.notifications()[0].id;
    store.dismiss(id);
    expect(store.notifications()).toHaveLength(0);
  });

  it('should only dismiss the targeted notification', () => {
    store.add({ kind: 'info', title: 'A' });
    store.add({ kind: 'info', title: 'B' });
    const id = store.notifications()[0].id;
    store.dismiss(id);
    expect(store.notifications()).toHaveLength(1);
    expect(store.notifications()[0].title).toBe('B');
  });

  it('should auto-dismiss after autoDismissMs', () => {
    vi.useFakeTimers();
    store.add({ kind: 'error', title: 'Auto', autoDismissMs: 5000 });
    expect(store.notifications()).toHaveLength(1);
    vi.advanceTimersByTime(5000);
    expect(store.notifications()).toHaveLength(0);
    vi.useRealTimers();
  });

  it('should not auto-dismiss when autoDismissMs is not set', () => {
    vi.useFakeTimers();
    store.add({ kind: 'info', title: 'Persistent' });
    vi.advanceTimersByTime(60000);
    expect(store.notifications()).toHaveLength(1);
    vi.useRealTimers();
  });
});

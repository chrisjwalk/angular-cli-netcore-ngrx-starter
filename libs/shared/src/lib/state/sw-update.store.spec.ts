import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { NotificationStore } from './notification.store';
import { SwUpdateStore } from './sw-update.store';

let mockOnNeedRefresh: (() => void) | undefined;
const mockUpdateSW = vi.fn().mockResolvedValue(undefined);

vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn((options: { onNeedRefresh?: () => void }) => {
    mockOnNeedRefresh = options.onNeedRefresh;
    return mockUpdateSW;
  }),
}));

describe('SwUpdateStore', () => {
  let store: InstanceType<typeof SwUpdateStore>;
  let notificationStore: InstanceType<typeof NotificationStore>;

  beforeEach(() => {
    mockOnNeedRefresh = undefined;
    mockUpdateSW.mockClear();

    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), NotificationStore, SwUpdateStore],
    });

    store = TestBed.inject(SwUpdateStore);
    notificationStore = TestBed.inject(NotificationStore);
  });

  it('should be created', () => {
    expect(store).toBeDefined();
  });

  it('should add a sw-update notification when refresh is needed', () => {
    mockOnNeedRefresh?.();

    expect(notificationStore.notifications()).toHaveLength(1);
    expect(notificationStore.notifications()[0]).toMatchObject({
      kind: 'sw-update',
      title: 'App update available',
    });
  });

  it('should not add notification before refresh is needed', () => {
    expect(notificationStore.notifications()).toHaveLength(0);
  });

  it('should call updateSW with reload when notification action is triggered', async () => {
    mockOnNeedRefresh?.();

    const notification = notificationStore.notifications()[0];
    await notification.action?.handler();

    expect(mockUpdateSW).toHaveBeenCalledWith(true);
  });
});

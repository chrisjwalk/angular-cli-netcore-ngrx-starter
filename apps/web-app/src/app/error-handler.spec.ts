import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NotificationStore } from '@myorg/shared';

import { AppErrorHandler } from './error-handler';

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler;
  let store: InstanceType<typeof NotificationStore>;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {
      // silence the expected console.error in the handler under test
    });
    TestBed.configureTestingModule({
      providers: [AppErrorHandler, NotificationStore],
    });

    handler = TestBed.inject(AppErrorHandler);
    store = TestBed.inject(NotificationStore);
  });

  it('should notify the store for unhandled errors', () => {
    handler.handleError(new Error('boom'));

    expect(store.notifications()).toHaveLength(1);
    expect(store.notifications()[0].title).toBe('Unexpected error');
    expect(store.notifications()[0].detail).toBe('boom');
  });

  it('should not double-notify for HTTP errors', () => {
    handler.handleError(new HttpErrorResponse({ status: 500 }));

    expect(store.notifications()).toHaveLength(0);
  });
});

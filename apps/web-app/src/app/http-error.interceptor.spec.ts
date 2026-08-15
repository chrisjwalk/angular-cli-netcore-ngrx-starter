import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationStore } from '@myorg/shared';

import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let store: InstanceType<typeof NotificationStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        NotificationStore,
      ],
    });

    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    store = TestBed.inject(NotificationStore);
  });

  afterEach(() => {
    controller.verify();
  });

  const flushError = (status: number, statusText = 'Error') => {
    let received: unknown;
    http.get('/api/test').subscribe({ error: (error) => (received = error) });
    const req = controller.expectOne('/api/test');
    req.flush({ message: 'boom' }, { status, statusText });
    return received;
  };

  it('should notify on 5xx and rethrow', () => {
    const error = flushError(500, 'Internal Server Error');

    expect(store.notifications()).toHaveLength(1);
    expect(store.notifications()[0].kind).toBe('error');
    expect(store.notifications()[0].title).toBe('Server error');
    expect(error).toBeTruthy();
  });

  it('should notify on network errors (status 0)', () => {
    let received: unknown;
    http.get('/api/test').subscribe({ error: (error) => (received = error) });
    const req = controller.expectOne('/api/test');
    req.error(new ProgressEvent('error'));

    expect(store.notifications()).toHaveLength(1);
    expect(store.notifications()[0].title).toBe('Network error');
    expect(received).toBeTruthy();
  });

  it('should not notify on 400, 401, 404, or 429 but still rethrow', () => {
    [400, 401, 404, 429].forEach((status) => flushError(status));

    expect(store.notifications()).toHaveLength(0);
  });
});

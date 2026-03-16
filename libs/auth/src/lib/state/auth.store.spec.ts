import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { loadingInitialState } from '@myorg/shared';
import { getState } from '@ngrx/signals';
import { of, throwError, firstValueFrom } from 'rxjs';

import { AuthService } from '../services/auth.service';
import {
  AuthStore,
  authInitialState,
  authResponseInitialState,
  loginRouterLink,
  requiresLoginCanActivateFn,
  requiresLoginCanDeactivateFn,
} from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;
  let authService: AuthService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideNoopAnimations()],
    });

    store = TestBed.inject(AuthStore);
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // No auth_status cookie in the test environment — store skips the refresh
    // call and immediately transitions to 'no-refresh-token'.
    httpTestingController.verify();
  });

  it('should be created', () =>
    TestBed.runInInjectionContext(() => {
      expect(store).toBeDefined();
    }));

  it('should have the no refresh token state when no auth_status cookie is present', () =>
    TestBed.runInInjectionContext(() => {
      expect(getState(store)).toEqual({
        ...authInitialState,
        ...loadingInitialState,
        loginStatus: 'no-refresh-token',
      });
    }));

  it('should set the loading state to true when login starts', () =>
    TestBed.runInInjectionContext(() => {
      store.loginStart();

      expect(store.loginLoading()).toBe(true);
    }));

  it('should set the loading state to false and the logged in state to true when login succeeds', () =>
    TestBed.runInInjectionContext(() => {
      store.loginSuccessful({
        ...authResponseInitialState,
        accessToken: 'token',
      });

      expect(store.loginLoading()).toBe(false);
      expect(store.loggedIn()).toBe(true);
    }));

  it('should set the loading state to false and the logged in state to false when login fails', () =>
    TestBed.runInInjectionContext(() => {
      const error = new Error('Login failed');
      store.loginFailure(error);

      expect(store.loginLoading()).toBe(false);
      expect(store.loggedIn()).toBe(false);
      expect(store.loginError()).toBe(true);
    }));

  it('should set the logged in state to logged out when logout is called', () =>
    TestBed.runInInjectionContext(() => {
      store.logout(false);
      expect(store.loginStatus()).toBe('logged-out');
      expect(store.loggedOut()).toBe(true);
      expect(store.loggedIn()).toBe(false);
    }));

  it('should set the status to logged in when login is succesful', () =>
    TestBed.runInInjectionContext(() => {
      vi.spyOn(authService, 'login').mockReturnValue(
        of({
          ...authResponseInitialState,
          expiresIn: 3600,
          accessToken: 'access-token',
        }),
      );
      store.login({
        email: 'username',
        password: 'password',
      });
      expect(store.loginStatus()).toBe('success');
      expect(store.loggedOut()).toBe(false);
      expect(store.loggedIn()).toBe(true);
      expect(store.accessToken()).toBe('access-token');
      expect(store.expiresAt()).toEqual(
        new Date(store.response().accessTokenIssued.getTime() + 3600 * 1000),
      );
      expect(store.expired()).toEqual(false);
      expect(store.loginSuccess()).toBe(true);
      expect(store.loginError()).toBe(false);
      expect(store.loginLoading()).toBe(false);
      expect(store.noRefreshTokenAvailable()).toBe(false);
      expect(store.loginAttempted()).toBe(true);
    }));

  it('should set the status to error in when login is not succesful', () =>
    TestBed.runInInjectionContext(() => {
      vi.spyOn(authService, 'login').mockReturnValue(
        throwError(() => new Error()),
      );
      store.login({
        email: 'username',
        password: 'password',
      });
      expect(store.loginStatus()).toBe('error');
      expect(store.loggedOut()).toBe(false);
      expect(store.loggedIn()).toBe(false);
      expect(store.loginError()).toBe(true);
      expect(store.expiresAt()).toEqual(null);
      expect(store.expired()).toEqual(null);
    }));

  it('should set the status to requires-2fa when the server requests a 2FA code', () =>
    TestBed.runInInjectionContext(() => {
      vi.spyOn(authService, 'login').mockReturnValue(
        of({ requiresTwoFactor: true }),
      );
      store.login({ email: 'username', password: 'password' });
      expect(store.loginStatus()).toBe('requires-2fa');
      expect(store.requiresTwoFactor()).toBe(true);
      expect(store.loggedIn()).toBe(false);
      expect(store.loginAttempted()).toBe(true);
    }));

  it('should set the status to expired in when login is succesful and but the expiresIn duration has passed', () =>
    TestBed.runInInjectionContext(() => {
      vi.spyOn(authService, 'login').mockReturnValue(
        of({
          ...authResponseInitialState,
          expiresIn: 0,
          accessToken: 'access-token',
        }),
      );
      store.login({
        email: 'username',
        password: 'password',
      });

      expect(store.expiresAt()).toEqual(
        new Date(store.response().accessTokenIssued.getTime() + 0 * 1000),
      );
      expect(store.expired()).toBe(true);
    }));

  it('should redirect to the page stored in state when login is successful', () =>
    TestBed.runInInjectionContext(() => {
      const route = new ActivatedRouteSnapshot();
      const state = { url: '/test' } as RouterStateSnapshot;
      const navigate = vi.spyOn(router, 'navigate');

      store.setRedirect(route, state);
      store.redirectAfterLogin();
      expect(navigate).toHaveBeenCalledWith(['/test']);
      expect(store.redirect()).toBe(null);
    }));

  it('should require login to access route', () =>
    TestBed.runInInjectionContext(() => {
      const route = new ActivatedRouteSnapshot();
      const state = { url: '/test' } as RouterStateSnapshot;
      // const navigate = vi.spyOn(router, 'navigate');

      requiresLoginCanActivateFn(route, state).subscribe((canActivate) => {
        expect(canActivate).toEqual(
          new RedirectCommand(router.parseUrl(loginRouterLink.join('/'))),
        );
        // expect(navigate).toHaveBeenCalledWith(loginRouterLink);
        expect(store.pageRequiresLogin()).toEqual(true);
        requiresLoginCanDeactivateFn();
        expect(store.pageRequiresLogin()).toEqual(false);
      });
    }));

  it('should allow navigation if already logged in', async () => {
    TestBed.runInInjectionContext(async () => {
      const route = new ActivatedRouteSnapshot();
      const state = { url: '/test' } as RouterStateSnapshot;
      store.loginSuccessful({
        ...authResponseInitialState,
        accessToken: 'token',
      });
      const canActivate = await firstValueFrom(
        requiresLoginCanActivateFn(route, state),
      );
      expect(canActivate).toBe(true);
    });
  });

  describe('with auth_status cookie', () => {
    let cookieStore: AuthStore;
    let cookieHttpController: HttpTestingController;

    beforeEach(() => {
      TestBed.inject(DOCUMENT).cookie = 'auth_status=1';
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClientTesting(), provideNoopAnimations()],
      });
      cookieStore = TestBed.inject(AuthStore);
      cookieHttpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      // Clear the indicator cookie so it does not bleed into other tests.
      TestBed.inject(DOCUMENT).cookie =
        'auth_status=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('should call /api/auth/refresh when auth_status cookie is present', () => {
      cookieHttpController
        .expectOne('/api/auth/refresh')
        .flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(cookieStore.loginStatus()).toBe('no-refresh-token');
    });

    it('should transition to success when refresh succeeds', () => {
      cookieHttpController.expectOne('/api/auth/refresh').flush({
        tokenType: 'Bearer',
        accessToken: 'new-access-token',
        expiresIn: 3600,
      });

      expect(cookieStore.loginStatus()).toBe('success');
      expect(cookieStore.accessToken()).toBe('new-access-token');
    });
  });
});

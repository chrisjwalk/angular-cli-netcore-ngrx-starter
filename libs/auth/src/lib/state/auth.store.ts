import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { withLoadingFeature } from '@myorg/shared';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
  type,
  withProps,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, startWith, switchMap, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

export type Login = {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
};

export type AuthResponse = {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
};

// Login returns either full tokens or a 2FA challenge.
export type LoginResponse = AuthResponse | { requiresTwoFactor: true };

export type AuthResponseState = AuthResponse & {
  accessTokenIssued: Date;
};

export const authResponseInitialState: AuthResponseState = {
  tokenType: null,
  accessToken: null,
  expiresIn: null,
  accessTokenIssued: null,
};

export type LoginStatus =
  | 'none'
  | 'no-refresh-token'
  | 'loading'
  | 'success'
  | 'error'
  | 'requires-2fa'
  | 'logged-out';

export type AuthState = {
  redirect: RedirectRouterState;
  response: AuthResponseState;
  pageRequiresLogin: boolean;
  loginStatus: LoginStatus;
};

export type RedirectRouterState = {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
};

export const authInitialState: AuthState = {
  redirect: null,
  response: authResponseInitialState,
  pageRequiresLogin: null,
  loginStatus: 'none',
};

export type AuthStore = InstanceType<typeof AuthStore>;

export const loginRouterLink = ['/login'];
export const homeRouterLink = ['/'];

export function withAuthFeature() {
  return signalStoreFeature(
    withState(authInitialState),
    withLoadingFeature(),
    withProps(({ loginStatus }) => ({
      router: inject(Router),
      authService: inject(AuthService),
      snackBar: inject(MatSnackBar),
      loginStatus$: toObservable(loginStatus).pipe(startWith(null)),
    })),
    withComputed((state) => ({
      expiresAt: computed(() =>
        state.response?.accessTokenIssued()
          ? new Date(
              state.response.accessTokenIssued().getTime() +
                state.response.expiresIn() * 1000,
            )
          : null,
      ),
      accessToken: computed(() => state.response.accessToken()),
      requiresTwoFactor: computed(() => state.loginStatus() === 'requires-2fa'),
      loginSuccess: computed(() => state.loginStatus() === 'success'),
      loginError: computed(() => state.loginStatus() === 'error'),
      loginLoading: computed(() => state.loginStatus() === 'loading'),
      noRefreshTokenAvailable: computed(
        () => state.loginStatus() === 'no-refresh-token',
      ),
      loggedOut: computed(() => state.loginStatus() === 'logged-out'),
    })),
    withComputed((state) => ({
      expired: computed(() =>
        state.expiresAt() ? state.expiresAt().getTime() <= Date.now() : null,
      ),
      loginAttempted: computed(
        () =>
          state.loginError() ||
          state.loginSuccess() ||
          state.noRefreshTokenAvailable() ||
          state.requiresTwoFactor(),
      ),
      loggedIn: computed(() => state.loginSuccess() && !!state.accessToken()),
    })),
    withMethods(({ router, ...store }) => ({
      loginStart() {
        patchState(store, {
          error: null,
          response: authResponseInitialState,
          loginStatus: 'loading',
        });
      },
      loginSuccessful(response: AuthResponse) {
        patchState(store, {
          loginStatus: 'success',
          response: { ...response, accessTokenIssued: new Date() },
        });
      },
      loginFailure(error: unknown) {
        patchState(store, {
          error,
          loginStatus: 'error',
        });
      },
      loginReset() {
        patchState(store, authInitialState);
      },
      redirectAfterLogin() {
        if (store.redirect()) {
          router.navigate([store.redirect().state.url]);
          patchState(store, { redirect: null });
        } else {
          router.navigate(homeRouterLink);
        }
      },
      loginRequired(pageRequiresLogin: boolean) {
        patchState(store, { pageRequiresLogin });
      },

      setRedirect(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        patchState(store, { redirect: { route, state } });
      },
      setResponse(response: AuthResponseState, loginStatus?: LoginStatus) {
        patchState(store, { response });
        if (loginStatus) {
          patchState(store, { loginStatus });
        }
      },
    })),
    withMethods(({ router, authService, snackBar, ...store }) => ({
      login: rxMethod<Login>(
        pipe(
          tap(() => store.loginStart()),
          switchMap((request) =>
            authService.login(request).pipe(
              tapResponse({
                next: (response) => {
                  if (
                    'requiresTwoFactor' in response &&
                    response.requiresTwoFactor
                  ) {
                    patchState(store, { loginStatus: 'requires-2fa' });
                    return;
                  }
                  snackBar.open('Login Successful', 'Close', {
                    duration: 5000,
                  });
                  store.redirectAfterLogin();
                  store.loginSuccessful(response as AuthResponse);
                },
                error: (error) => {
                  snackBar.open('Login failed', 'Close', {
                    duration: 5000,
                  });
                  store.loginFailure(error);
                },
              }),
            ),
          ),
        ),
      ),
      refresh: rxMethod<void>(
        pipe(
          tap(() => store.loginStart()),
          switchMap(() =>
            authService.refresh().pipe(
              tapResponse({
                next: (response) => store.loginSuccessful(response),
                // A 401 on refresh means no valid session exists — treat it as
                // "no stored session" so the login form is shown without an error.
                error: () =>
                  patchState(store, { loginStatus: 'no-refresh-token' }),
              }),
            ),
          ),
        ),
      ),
      logout: (redirectToLogin: boolean) => {
        // Revoke the server-side refresh token and clear the HttpOnly cookie.
        authService.logout().subscribe();
        store.loginReset();
        patchState(store, { loginStatus: 'logged-out' });
        if (redirectToLogin) {
          router.navigate(loginRouterLink);
        } else {
          snackBar.open('Logout Successful', 'Close', {
            duration: 5000,
          });
        }
      },
    })),
  );
}

export function withAuthHooks() {
  return signalStoreFeature(
    {
      methods: type<{ refresh: ReturnType<typeof rxMethod<void>> }>(),
    },
    withHooks({
      onInit(store) {
        // Attempt a silent token refresh on startup. If the HttpOnly refresh-token
        // cookie is present the server issues a new access token; otherwise it
        // returns 401 and the store transitions to 'no-refresh-token'.
        store.refresh();
      },
    }),
  );
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withAuthFeature(),
  withAuthHooks(),
);

export function requiresLoginCanActivateFn(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) {
  const store = inject(AuthStore);
  const router = inject(Router);

  store.loginRequired(true);

  return store.loginStatus$.pipe(
    filter(() => store.loginAttempted()),
    map(() => store.loggedIn()),
    map((loggedIn) => {
      if (!loggedIn) {
        store.setRedirect(route, state);
        return new RedirectCommand(router.parseUrl(loginRouterLink.join('/')));
      } else {
        return loggedIn;
      }
    }),
  );
}

export function requiresLoginCanDeactivateFn() {
  inject(AuthStore).loginRequired(false);

  return true;
}

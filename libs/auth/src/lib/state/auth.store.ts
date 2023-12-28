import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, startWith, switchMap, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

export type Refresh = {
  refreshToken: string;
};

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
  refreshToken: string;
};

export type AuthResponseState = AuthResponse & {
  accessTokenIssued: Date;
};

export const authResponseInitialState: AuthResponseState = {
  tokenType: null,
  accessToken: null,
  expiresIn: null,
  refreshToken: null,
  accessTokenIssued: null,
};

export type LoginStatus =
  | 'none'
  | 'no-refresh-token'
  | 'loading'
  | 'success'
  | 'error'
  | 'logged-out';

export type AuthState = {
  error: any;
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
  error: null,
  redirect: null,
  response: authResponseInitialState,
  pageRequiresLogin: null,
  loginStatus: 'none',
};

export type AuthStoreInstance = InstanceType<typeof AuthStore>;

export const refreshTokenKey = 'refreshToken';
export const loginRouterLink = ['/login'];
export const homeRouterLink = ['/'];

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(authInitialState),
  withComputed((state) => ({
    expiresAt: computed(() =>
      state.response()
        ? new Date(
            state.response().accessTokenIssued.getTime() +
              state.response().expiresIn * 1000,
          )
        : null,
    ),
    accessToken: computed(() => state.response().accessToken),
    refreshToken: computed(() => state.response().refreshToken),
    loginSuccess: computed(() => state.loginStatus() === 'success'),
    loginError: computed(() => state.loginStatus() === 'error'),
    loading: computed(() => state.loginStatus() === 'loading'),
    noRefreshTokenAvailable: computed(
      () => state.loginStatus() === 'no-refresh-token',
    ),
    loggedOut: computed(() => state.loginStatus() === 'logged-out'),
  })),
  withComputed((state) => ({
    expired: computed(() =>
      state.expiresAt() ? state.expiresAt().getTime() < Date.now() : null,
    ),
    loginAttempted: computed(
      () =>
        state.loginError() ||
        state.loginSuccess() ||
        state.noRefreshTokenAvailable(),
    ),
    loggedIn: computed(() => state.loginSuccess() && !!state.accessToken()),
  })),
  withMethods((store, router = inject(Router)) => ({
    loginStart() {
      removeRefreshToken();
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
      storeRefreshToken(response);
    },
    loginFailure(error: any) {
      console.error(error);
      patchState(store, {
        error,
        loginStatus: 'error',
      });
    },
    loginReset() {
      removeRefreshToken();
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
    loginStatusToObservable() {
      return toObservable(store.loginStatus).pipe(startWith(null));
    },
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      snackBar = inject(MatSnackBar),
      router = inject(Router),
    ) => ({
      login: rxMethod<Login>(
        pipe(
          tap(() => store.loginStart()),
          switchMap((request) =>
            authService.login(request).pipe(
              tapResponse(
                (response) => {
                  snackBar.open('Login Successful', 'Close', {
                    duration: 5000,
                  });
                  store.redirectAfterLogin();
                  store.loginSuccessful(response);
                },
                (error) => {
                  snackBar.open('Login failed', 'Close', {
                    duration: 5000,
                  });
                  store.loginFailure(error);
                },
              ),
            ),
          ),
        ),
      ),
      refresh: rxMethod<Refresh>(
        pipe(
          tap(() => store.loginStart()),
          switchMap((refresh) =>
            authService.refresh(refresh).pipe(
              tapResponse(
                (response) => store.loginSuccessful(response),
                (error) => store.loginFailure(error),
              ),
            ),
          ),
        ),
      ),
      logout: (redirectToLogin: boolean) => {
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
    }),
  ),
  withHooks({
    onInit(store) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        store.refresh({ refreshToken });
      } else {
        patchState(store, { loginStatus: 'no-refresh-token' });
      }
    },
  }),
);

export function storeRefreshToken(response: AuthResponse) {
  localStorage.setItem(refreshTokenKey, response.refreshToken);
}

export function getRefreshToken() {
  return localStorage.getItem(refreshTokenKey);
}

export function removeRefreshToken() {
  return localStorage.removeItem(refreshTokenKey);
}

export function requiresLoginCanActivateFn(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) {
  const store = inject(AuthStore);
  const router = inject(Router);
  const loginStatus$ = store.loginStatusToObservable();

  store.loginRequired(true);

  return loginStatus$.pipe(
    filter(() => store.loginAttempted()),
    map(() => store.loggedIn()),
    tap((loggedIn) => {
      if (!loggedIn) {
        patchState(store, { redirect: { route, state } });
        router.navigate(loginRouterLink);
      }
    }),
  );
}

export function requiresLoginCanDeactivateFn() {
  inject(AuthStore).loginRequired(false);

  return true;
}

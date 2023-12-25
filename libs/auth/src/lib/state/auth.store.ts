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
import { filter, pipe, switchMap, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

export type Refresh = {
  refreshToken: string;
};

export type Login = {
  email: string;
  password: string;
  twoFactorCode: string;
  twoFactorRecoveryCode: string;
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

export type AuthState = {
  loading: boolean;
  error: any;
  missingRefreshToken: boolean;
  redirect: RedirectRouterState;
  loggedIn: boolean;
  response: AuthResponseState;
  pageRequiresLogin: boolean;
};

export type RedirectRouterState = {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
};

export const authInitialState: AuthState = {
  loading: null,
  error: null,
  missingRefreshToken: null,
  redirect: null,
  loggedIn: null,
  response: authResponseInitialState,
  pageRequiresLogin: null,
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
  })),
  withComputed((state) => ({
    expired: computed(() =>
      state.expiresAt() ? state.expiresAt().getTime() < Date.now() : null,
    ),
  })),
  withMethods((store, router = inject(Router)) => ({
    loginStart() {
      removeRefreshToken();
      patchState(store, {
        loggedIn: null,
        error: null,
        loading: true,
        response: authResponseInitialState,
      });
    },
    loginSuccess(response: AuthResponse) {
      patchState(store, {
        loading: false,
        loggedIn: true,
        response: { ...response, accessTokenIssued: new Date() },
      });
      storeRefreshToken(response);
    },
    loginError(error: any) {
      console.error(error);
      patchState(store, { error, loggedIn: false, loading: false });
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
                  store.loginSuccess(response);
                },
                (error) => {
                  snackBar.open('Login failed', 'Close', {
                    duration: 5000,
                  });
                  store.loginError(error);
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
                (response) => store.loginSuccess(response),
                (error) => store.loginError(error),
              ),
            ),
          ),
        ),
      ),
      logout: (redirectToLogin: boolean) => {
        store.loginReset();
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
        patchState(store, { missingRefreshToken: true });
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
  const authStore = inject(AuthStore);
  const router = inject(Router);

  patchState(authStore, { pageRequiresLogin: true });

  return toObservable(authStore.loggedIn).pipe(
    filter((loggedIn) => loggedIn !== null || authStore.missingRefreshToken()),
    tap(() => {
      if (!authStore.loggedIn()) {
        patchState(authStore, { redirect: { route, state } });
        router.navigate(loginRouterLink);
      }
    }),
  );
}

export function requiresLoginCanDeactivateFn() {
  const authStore = inject(AuthStore);

  patchState(authStore, { pageRequiresLogin: false });

  return true;
}

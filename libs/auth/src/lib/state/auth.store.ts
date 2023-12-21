import { inject } from '@angular/core';
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
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

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

export type AuthResponseState = {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export const authResponseInitialState: AuthResponseState = {
  tokenType: null,
  accessToken: null,
  expiresIn: null,
  refreshToken: null,
};

export type AuthState = {
  loading: boolean;
  error: any;
  missingRefreshToken: boolean;
  redirect: RedirectRouterState;
  loggedIn: boolean;
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
};

export const AuthResponseStore = signalStore(
  { providedIn: 'root' },
  withState(authResponseInitialState),
);

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(authInitialState),
  withMethods(
    (
      store,
      loginService = inject(AuthService),
      snackBar = inject(MatSnackBar),
      router = inject(Router),
      authResponseStore = inject(AuthResponseStore),
    ) => ({
      login: rxMethod<Login>(
        pipe(
          tap(() => {
            removeRefreshToken();
            patchState(store, { loggedIn: null, error: null, loading: true });
          }),
          switchMap((request) =>
            loginService.login(request).pipe(
              tapResponse(
                (response) => {
                  snackBar.open('Login Successful', 'Close', {
                    duration: 5000,
                  });
                  patchState(store, {
                    loading: false,
                  });
                  if (store.redirect()) {
                    router.navigate([store.redirect().state.url]);
                    patchState(store, { redirect: null });
                  } else {
                    router.navigate(['/']);
                  }
                  storeRefreshToken(response);
                  patchState(authResponseStore, response);
                  patchState(store, { loggedIn: true });
                },
                (error) => {
                  console.error(error);
                  snackBar.open('Login failed', 'Close', {
                    duration: 5000,
                  });
                  patchState(store, { error, loading: false });
                },
              ),
            ),
          ),
        ),
      ),
      refresh: rxMethod<Refresh>(
        pipe(
          tap(() => {
            removeRefreshToken();
            patchState(store, { loggedIn: null, error: null, loading: true });
          }),
          switchMap((refresh) =>
            loginService.refresh(refresh).pipe(
              tapResponse(
                (response) => {
                  storeRefreshToken(response);
                  patchState(authResponseStore, response);
                  patchState(store, {
                    loading: false,
                    loggedIn: true,
                  });
                },
                (error) => {
                  console.error(error);
                  patchState(store, { error, loading: false });
                },
              ),
            ),
          ),
        ),
      ),
      logout: () => {
        removeRefreshToken();
        patchState(store, authInitialState);
        snackBar.open('Logout Successful', 'Close', {
          duration: 5000,
        });
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

export const refreshTokenKey = 'refreshToken';
export const loginRouterLink = ['/login'];

export function storeRefreshToken(response: AuthResponseState) {
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

  if (!authStore.loggedIn()) {
    patchState(authStore, { redirect: { route, state } });
    router.navigate(loginRouterLink);
    return false;
  }

  return true;
}

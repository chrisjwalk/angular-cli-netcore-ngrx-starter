import { HttpBackend, HttpClient } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';

import { AuthResponse, Login, Refresh } from '../state/auth.store';

const authServiceFactory = (httpBackend = inject(HttpBackend)) => {
  const http = new HttpClient(httpBackend);
  return {
    login(login: Login) {
      return http.post<AuthResponse>('/api/account/login', login);
    },
    refresh(refresh: Refresh) {
      return http.post<AuthResponse>('/api/account/refresh', refresh);
    },
  };
};

export const AuthService = new InjectionToken('AuthService', {
  providedIn: 'root',
  factory: authServiceFactory,
});

export type AuthService = ReturnType<typeof authServiceFactory>;

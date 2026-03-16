import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AuthResponse, Login, LoginResponse } from '../state/auth.store';

// HttpBackend is injected directly (bypassing interceptors) to avoid an
// infinite loop: the auth interceptor would otherwise intercept its own
// refresh/login requests and try to refresh again on 401.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = new HttpClient(inject(HttpBackend));

  login(login: Login) {
    return this.http.post<LoginResponse>('/api/auth/login', login, {
      withCredentials: true,
    });
  }

  // No request body: the browser sends the HttpOnly refresh-token cookie automatically.
  refresh() {
    return this.http.post<AuthResponse>(
      '/api/auth/refresh',
      {},
      {
        withCredentials: true,
      },
    );
  }

  // Instructs the server to revoke the refresh token and clear the cookie.
  logout() {
    return this.http.post<void>(
      '/api/auth/logout',
      {},
      {
        withCredentials: true,
      },
    );
  }
}

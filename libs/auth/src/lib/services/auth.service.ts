import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AuthResponse, Login, Refresh } from '../state/auth.store';

// HttpBackend is injected directly (bypassing interceptors) to avoid an
// infinite loop: the auth interceptor would otherwise intercept its own
// refresh/login requests and try to refresh again on 401.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = new HttpClient(inject(HttpBackend));

  login(login: Login) {
    return this.http.post<AuthResponse>('/api/account/login', login);
  }

  refresh(refresh: Refresh) {
    return this.http.post<AuthResponse>('/api/account/refresh', refresh);
  }
}

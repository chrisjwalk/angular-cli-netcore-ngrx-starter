import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse, Login, Refresh } from '../state/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpBackend = inject(HttpBackend);
  private http = new HttpClient(this.httpBackend);

  login(login: Login) {
    return this.http.post<AuthResponse>('/api/account/login', login);
  }
  refresh(refresh: Refresh) {
    return this.http.post<AuthResponse>('/api/account/refresh', refresh);
  }
}

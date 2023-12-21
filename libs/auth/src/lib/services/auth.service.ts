import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Login, Refresh } from '../state/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(login: Login) {
    return this.http.post<any>('/api/account/login', login);
  }
  refresh(refresh: Refresh) {
    return this.http.post<any>('/api/account/refresh', refresh);
  }
}

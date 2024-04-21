import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { authResponseInitialState } from '../state/auth.store';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: 'BASE_URL', useValue: '' },
      ],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('authService.login() should return data', () => {
    const response = {
      ...authResponseInitialState,
      expiresIn: 0,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    authService
      .login({ email: 'email', password: 'test' })
      .subscribe((result) => {
        expect(result).toEqual(response);
      });

    const req = httpTestingController.expectOne('/api/account/login');
    expect(req.request.method).toEqual('POST');
    req.flush([response]);
  });

  it('authService.refresh() should return data', () => {
    const response = {
      ...authResponseInitialState,
      expiresIn: 0,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    authService
      .refresh({ refreshToken: 'refresh-token' })
      .subscribe((result) => {
        expect(result).toEqual(response);
      });

    const req = httpTestingController.expectOne('/api/account/refresh');
    expect(req.request.method).toEqual('POST');
    req.flush([response]);
  });
});

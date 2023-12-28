import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import {
  LoginStore,
  LoginStoreInstance,
  defaultLoginRequest,
  getLoginFormGroup,
} from './login.store';
import { inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

describe('LoginStore', () => {
  let store: LoginStoreInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideNoopAnimations()],
    });

    store = TestBed.inject(LoginStore);
  });

  it('should be created', () =>
    TestBed.runInInjectionContext(() => {
      expect(store).toBeDefined();
    }));

  it('should get the login form group and sync with store', () =>
    TestBed.runInInjectionContext(() => {
      const formGroup = getLoginFormGroup(inject(FormBuilder), store);
      expect(formGroup).toBeDefined();
      expect(formGroup.controls.email).toBeDefined();
      expect(formGroup.controls.email.value).toBe(defaultLoginRequest.email);

      formGroup.controls.email.setValue('another@email.com');
      expect(store.request().email).toBe('another@email.com');
      formGroup.controls.password.setValue('password');
      expect(store.request().password).toBe('password');
      expect(formGroup.valid).toBe(true);
      expect(store.valid()).toBe(true);

      formGroup.controls.email.setValue('');
      expect(store.request().email).toBe('');
      formGroup.controls.password.setValue('');
      expect(store.request().password).toBe('');
      expect(formGroup.valid).toBe(false);
      expect(store.valid()).toBe(false);
    }));
});

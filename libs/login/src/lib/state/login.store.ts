import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Login } from '@myorg/auth';
import { patchState, signalStore, withState } from '@ngrx/signals';

export type LoginState = {
  request: Login;
  valid: boolean;
};

export const defaultLoginRequest: Login = {
  email: 'test@test.com',
  password: 'SuperSecret1!',
  twoFactorCode: null,
  twoFactorRecoveryCode: null,
};

export const loginInitialState: LoginState = {
  request: defaultLoginRequest,
  valid: null,
};

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withState(loginInitialState),
);

export function getLoginFormGroup(
  formBuilder: FormBuilder,
  store: LoginStoreInstance,
) {
  const { email, password, twoFactorCode, twoFactorRecoveryCode } =
    store.request();

  const formGroup = formBuilder.group({
    email: [email, [Validators.required]],
    password: [password, [Validators.required]],
    twoFactorCode: [twoFactorCode],
    twoFactorRecoveryCode: [twoFactorRecoveryCode],
  });

  patchState(store, { ...formGroup.value, valid: formGroup.valid });

  formGroup.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((value) =>
      patchState(store, { request: value as Login, valid: formGroup.valid }),
    );

  return formGroup;
}

export type LoginStoreInstance = InstanceType<typeof LoginStore>;
export type LoginFormGroup = ReturnType<typeof getLoginFormGroup>;

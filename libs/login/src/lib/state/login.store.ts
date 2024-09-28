import { FormBuilder, Validators } from '@angular/forms';
import { Login } from '@myorg/auth';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, startWith } from 'rxjs';

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

export function withLoginFeature() {
  return signalStoreFeature(
    withState(loginInitialState),
    withMethods((store) => ({
      syncFormGroup: rxMethod<LoginState>(
        pipe(map((state) => patchState(store, state))),
      ),
    })),
  );
}

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withLoginFeature(),
);

export function getLoginFormGroup(formBuilder: FormBuilder, store: LoginStore) {
  const { email, password, twoFactorCode, twoFactorRecoveryCode } =
    store.request();

  const formGroup = formBuilder.group({
    email: [email, [Validators.required, Validators.email]],
    password: [password, [Validators.required]],
    twoFactorCode: [twoFactorCode],
    twoFactorRecoveryCode: [twoFactorRecoveryCode],
  });

  store.syncFormGroup(
    formGroup.valueChanges.pipe(
      startWith(formGroup.value),
      map((value) => ({ request: value as Login, valid: formGroup.valid })),
    ),
  );

  return formGroup;
}

export type LoginStore = InstanceType<typeof LoginStore>;
export type LoginFormGroup = ReturnType<typeof getLoginFormGroup>;

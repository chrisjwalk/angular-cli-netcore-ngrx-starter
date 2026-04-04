import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthStore } from '@myorg/auth';
import { LayoutStore } from '@myorg/shared';

import { LoginStore, getLoginFormGroup } from '../state/login.store';

@Component({
  selector: 'lib-login',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatSuffix,
    MatProgressSpinner,
  ],
  template: `
    <div class="h-full flex items-center justify-center p-6 bg-background">
      <form
        [formGroup]="formGroup"
        class="flex flex-col gap-5 w-full max-w-sm bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-none"
        (keyup.enter)="store.valid() ? authStore.login(store.request()) : null"
      >
        <div class="mb-3">
          <h2 class="text-on-surface text-2xl font-bold tracking-tight mb-1">
            Welcome back
          </h2>
          <p class="text-on-surface-variant text-sm">
            Sign in to your account to continue.
          </p>
        </div>
        @if (!authStore.loginLoading()) {
          @if (authStore.requiresTwoFactor()) {
            <p class="text-sm text-on-surface-variant">
              Two-factor authentication is required. Enter the code from your
              authenticator app.
            </p>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-on-surface-variant text-xs font-semibold"
                for="login-2fa"
                >Authenticator code</label
              >
              <mat-form-field
                appearance="outline"
                subscriptSizing="dynamic"
                class="w-full"
              >
                <input
                  matInput
                  id="login-2fa"
                  formControlName="twoFactorCode"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                />
              </mat-form-field>
            </div>
          } @else {
            <div class="flex flex-col gap-1.5">
              <label
                class="text-on-surface-variant text-xs font-semibold"
                for="login-email"
                >Email</label
              >
              <mat-form-field
                appearance="outline"
                subscriptSizing="dynamic"
                class="w-full"
              >
                <input
                  matInput
                  id="login-email"
                  formControlName="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                />
              </mat-form-field>
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-on-surface-variant text-xs font-semibold"
                for="login-password"
                >Password</label
              >
              <mat-form-field
                appearance="outline"
                subscriptSizing="dynamic"
                class="w-full"
              >
                <input
                  matInput
                  id="login-password"
                  formControlName="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  matSuffix
                  mat-icon-button
                  type="button"
                  [attr.aria-label]="
                    showPassword() ? 'Hide password' : 'Show password'
                  "
                  (click)="showPassword.set(!showPassword())"
                >
                  <mat-icon>{{
                    showPassword() ? 'visibility_off' : 'visibility'
                  }}</mat-icon>
                </button>
              </mat-form-field>
            </div>
          }
        } @else {
          <div class="flex flex-col gap-1.5">
            <div
              class="h-4 w-10 rounded-sm bg-surface-container dark:bg-surface-container-high"
            ></div>
            <div
              class="h-[3.25rem] rounded-lg bg-surface-container dark:bg-surface-container-high"
            ></div>
          </div>
          <div class="flex flex-col gap-1.5">
            <div
              class="h-4 w-16 rounded-sm bg-surface-container dark:bg-surface-container-high"
            ></div>
            <div
              class="h-[3.25rem] rounded-lg bg-surface-container dark:bg-surface-container-high"
            ></div>
          </div>
        }
        <button
          mat-flat-button
          class="w-full mt-1"
          [disabled]="!store.valid() || authStore.loginLoading()"
          (click)="authStore.login(store.request())"
        >
          <span class="flex gap-2 items-center justify-center">
            @if (authStore.loginLoading()) {
              <mat-spinner [diameter]="20" [strokeWidth]="2" color="accent" />
            }
            <span>{{
              authStore.requiresTwoFactor() ? 'Verify' : 'Sign in'
            }}</span>
          </span>
        </button>
      </form>
    </div>
  `,
  host: {
    class: 'h-full block',
    'data-testid': 'lib-login',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly layoutStore = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
  readonly store = inject(LoginStore);
  readonly showPassword = signal(false);

  readonly formGroup = getLoginFormGroup(this.formBuilder, this.store);

  constructor() {
    this.layoutStore.setTitle('Login');
    this.layoutStore.setHideToolbar(true);
    this.destroyRef.onDestroy(() => this.layoutStore.setHideToolbar(false));
  }
}

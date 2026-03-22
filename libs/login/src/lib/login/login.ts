import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthStore } from '@myorg/auth';
import { LayoutStore } from '@myorg/shared';

import { LoginStore, getLoginFormGroup } from '../state/login.store';

@Component({
  selector: 'lib-login',
  imports: [ReactiveFormsModule, MatButton, MatProgressSpinner],
  template: `
    <div class="h-full flex items-center justify-center p-6 bg-background">
      <div class="w-full max-w-sm">
        <div class="mb-8">
          <h2 class="text-on-surface text-2xl font-bold tracking-tight mb-1">
            Welcome back
          </h2>
          <p class="text-on-surface-variant text-sm">
            Sign in to your account to continue.
          </p>
        </div>
        <form
          [formGroup]="formGroup"
          class="flex flex-col gap-5 bg-surface-container-low rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          (keyup.enter)="
            store.valid() ? authStore.login(store.request()) : null
          "
        >
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
                <input
                  id="login-2fa"
                  formControlName="twoFactorCode"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  class="bg-surface-container-lowest rounded-xl px-4 py-3 text-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                />
              </div>
            } @else {
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-on-surface-variant text-xs font-semibold"
                  for="login-email"
                  >Email</label
                >
                <input
                  id="login-email"
                  formControlName="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="bg-surface-container-lowest rounded-xl px-4 py-3 text-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-on-surface-variant text-xs font-semibold"
                  for="login-password"
                  >Password</label
                >
                <input
                  id="login-password"
                  formControlName="password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="bg-surface-container-lowest rounded-xl px-4 py-3 text-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                />
              </div>
            }
          } @else {
            <div class="flex flex-col gap-4">
              <div
                class="loading h-[3.25rem] rounded-xl bg-surface-container dark:bg-surface-container-high"
              ></div>
              <div
                class="loading h-[3.25rem] rounded-xl bg-surface-container dark:bg-surface-container-high"
              ></div>
            </div>
          }
          <button
            mat-flat-button
            class="w-full mt-1"
            [disabled]="!store.valid() || authStore.loginLoading()"
            (click)="authStore.login(store.request())"
          >
            <span class="flex gap-2 items-center justify-center py-1">
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

  readonly formGroup = getLoginFormGroup(this.formBuilder, this.store);

  constructor() {
    this.layoutStore.setTitle('Login');
    this.layoutStore.setHideToolbar(true);
    this.destroyRef.onDestroy(() => this.layoutStore.setHideToolbar(false));
  }
}

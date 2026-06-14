import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthStore } from '@myorg/auth';
import { LayoutStore } from '@myorg/shared';
import {
  HlmButton,
  HlmField,
  HlmInput,
  HlmLabel,
  HlmSpinner,
} from '@myorg/spartan';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';

import { LoginStore, getLoginFormGroup } from '../state/login.store';

@Component({
  selector: 'lib-login',
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmField,
    HlmInput,
    HlmLabel,
    HlmSpinner,
    LucideAngularModule,
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
            <hlm-field>
              <label hlmLabel for="login-2fa">Authenticator code</label>
              <input
                hlmInput
                id="login-2fa"
                formControlName="twoFactorCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
              />
            </hlm-field>
          } @else {
            <hlm-field>
              <label hlmLabel for="login-email">Email</label>
              <input
                hlmInput
                id="login-email"
                formControlName="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
              />
            </hlm-field>
            <hlm-field>
              <label hlmLabel for="login-password">Password</label>
              <div class="relative">
                <input
                  hlmInput
                  id="login-password"
                  class="pr-10"
                  formControlName="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  hlmButton
                  variant="ghost"
                  size="icon"
                  type="button"
                  class="absolute right-1 top-1/2 -translate-y-1/2"
                  [attr.aria-label]="
                    showPassword() ? 'Hide password' : 'Show password'
                  "
                  (click)="showPassword.set(!showPassword())"
                >
                  <lucide-icon
                    [name]="showPassword() ? eyeOffIcon : eyeIcon"
                    class="h-4 w-4"
                  />
                </button>
              </div>
            </hlm-field>
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
          hlmButton
          variant="default"
          class="w-full mt-1"
          [disabled]="!store.valid() || authStore.loginLoading()"
          (click)="authStore.login(store.request())"
        >
          <span class="flex gap-2 items-center justify-center">
            @if (authStore.loginLoading()) {
              <hlm-spinner [diameter]="20" [strokeWidth]="2" />
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

  readonly eyeIcon = Eye;
  readonly eyeOffIcon = EyeOff;

  readonly formGroup = getLoginFormGroup(this.formBuilder, this.store);

  constructor() {
    this.layoutStore.setTitle('Login');
    this.layoutStore.setHideToolbar(true);
    this.destroyRef.onDestroy(() => this.layoutStore.setHideToolbar(false));
  }
}

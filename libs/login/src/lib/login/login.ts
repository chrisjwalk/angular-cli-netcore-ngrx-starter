import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthStore } from '@myorg/auth';
import { LayoutStore } from '@myorg/shared';

import { LoginStore, getLoginFormGroup } from '../state/login.store';

@Component({
  selector: 'lib-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatProgressSpinner,
    MatLabel,
  ],
  template: `
    <div
      class="flex flex-col min-h-full items-center justify-center p-6 bg-background"
    >
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
          class="flex flex-col gap-4 bg-surface-container-low rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
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
              <mat-form-field appearance="outline">
                <mat-label>Authenticator code</mat-label>
                <input
                  matInput
                  formControlName="twoFactorCode"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                />
              </mat-form-field>
            } @else {
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  formControlName="email"
                  type="email"
                  autocomplete="email"
                />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  formControlName="password"
                  type="password"
                  autocomplete="current-password"
                />
              </mat-form-field>
            }
          } @else {
            <div class="flex flex-col gap-4">
              <div
                class="loading h-14 rounded-lg bg-surface-container-low dark:bg-surface-container-high"
              ></div>
              <div
                class="loading h-14 rounded-lg bg-surface-container-low dark:bg-surface-container-high"
              ></div>
            </div>
          }
          <button
            mat-flat-button
            class="w-full mt-2"
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
    class: 'flex flex-col flex-1 min-h-full',
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

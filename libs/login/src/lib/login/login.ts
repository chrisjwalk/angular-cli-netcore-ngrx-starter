import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '@myorg/auth';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';

import { LoginStore, getLoginFormGroup } from '../state/login.store';

@Component({
  selector: 'lib-login',
  imports: [
    ReactiveFormsModule,
    PageContainer,
    PageToolbar,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <lib-page-toolbar [title]="layoutStore.title()"> </lib-page-toolbar>
    <lib-page-container>
      <div class="flex flex-row justify-center">
        <form
          [formGroup]="formGroup"
          class="flex flex-col gap-4 flex-1 max-w-sm p-4 bg-white/95 dark:bg-neutral-700 rounded-sm shadow-sm"
          (keyup.enter)="
            store.valid() ? authStore.login(store.request()) : null
          "
        >
          @if (!authStore.loginLoading()) {
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Pasasword</mat-label>
              <input matInput formControlName="password" type="password" />
            </mat-form-field>
          } @else {
            <div class="flex flex-col gap-4">
              <div
                class="loading h-48 bg-neutral-300 dark:bg-neutral-700"
              ></div>
            </div>
          }
          <div class="flex gap-4 justify-end">
            <button
              mat-raised-button
              color="primary"
              [disabled]="!store.valid() || authStore.loginLoading()"
              (click)="authStore.login(store.request())"
            >
              <span class="flex gap-2 items-center">
                @if (authStore.loginLoading()) {
                  <mat-spinner
                    [diameter]="20"
                    [strokeWidth]="2"
                    color="accent"
                  />
                }
                <span>Login</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-login',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);

  readonly layoutStore = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
  readonly store = inject(LoginStore);

  readonly formGroup = getLoginFormGroup(this.formBuilder, this.store);

  constructor() {
    this.layoutStore.setTitle('Login');
  }
}

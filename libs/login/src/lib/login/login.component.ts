import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarComponent,
} from '@myorg/shared';
import { getState } from '@ngrx/signals';

import { LoginStore, getLoginFormGroup } from '../state/login.store';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageContainerComponent,
    PageToolbarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    @if (vm(); as vm) {
      <lib-page-toolbar [title]="vm.title"> </lib-page-toolbar>
      <lib-page-container>
        <div class="flex flex-row justify-center">
          <form
            [formGroup]="formGroup"
            class="flex flex-col gap-4 flex-1 max-w-sm p-4 bg-white/95 dark:bg-neutral-700 rounded shadow"
            (keyup.enter)="vm.valid ? authStore.login(vm.request) : null"
          >
            @if (!vm.loading) {
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
                [disabled]="!vm.valid || vm.loading"
                (click)="authStore.login(vm.request)"
              >
                <span class="flex gap-2 items-center">
                  @if (vm.loading) {
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
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private layoutStore = inject(LayoutStore);

  authStore = inject(AuthStore);
  store = inject(LoginStore);

  vm = computed(() => ({
    ...getState(this.layoutStore),
    ...getState(this.store),
    loading: this.authStore.loading(),
  }));
  formGroup = getLoginFormGroup(this.formBuilder, this.store);

  @HostBinding('attr.data-testid') testid = 'lib-login';

  ngOnInit() {
    this.layoutStore.setTitle('Login');
  }
}

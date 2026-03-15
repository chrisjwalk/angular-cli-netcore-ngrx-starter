import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { NotificationStore } from '@myorg/shared';

@Component({
  imports: [MatButton, MatDivider],
  template: `
    <div class="p-8 max-w-lg flex flex-col gap-4">
      <h1 class="text-2xl font-bold m-0">🛠 Debug Tools</h1>
      <p class="text-sm text-neutral-500 m-0">
        Not linked from the nav. Use to test features during development.
      </p>

      <mat-divider />

      <h2 class="text-base font-semibold m-0">Notifications</h2>

      <div class="flex flex-wrap gap-2">
        <button mat-stroked-button (click)="addInfo()">Add info</button>
        <button mat-stroked-button (click)="addError()">Add error</button>
        <button mat-stroked-button (click)="addAuth()">Add auth</button>
        <button mat-stroked-button (click)="addSwUpdate()">
          Add sw-update
        </button>
        <button mat-stroked-button (click)="addWithAction()">
          Add with action
        </button>
        <button mat-stroked-button (click)="addAutoDismiss()">
          Add auto-dismiss (3s)
        </button>
      </div>

      <div class="flex gap-2">
        <button mat-stroked-button color="warn" (click)="store.markAllRead()">
          Mark all read
        </button>
        <button mat-flat-button color="warn" (click)="clearAll()">
          Clear all
        </button>
      </div>

      <p class="text-sm text-neutral-500 m-0">
        Unread: {{ store.unreadCount() }} / Total:
        {{ store.notifications().length }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Debug {
  readonly store = inject(NotificationStore);

  addInfo() {
    this.store.add({
      kind: 'info',
      title: 'Info notification',
      detail: 'This is a sample informational message.',
    });
  }

  addError() {
    this.store.add({
      kind: 'error',
      title: 'Something went wrong',
      detail: 'An unexpected error occurred. Please try again.',
    });
  }

  addAuth() {
    this.store.add({
      kind: 'auth',
      title: 'Session expiring soon',
      detail: 'You will be logged out in 5 minutes.',
    });
  }

  addSwUpdate() {
    this.store.add({
      kind: 'sw-update',
      title: 'App update available',
      detail: 'A new version is ready. Reload to update.',
      action: {
        label: 'Reload',
        handler: () => window.location.reload(),
      },
    });
  }

  addWithAction() {
    this.store.add({
      kind: 'info',
      title: 'Action required',
      detail: 'Click the button to perform an action.',
      action: {
        label: 'Do it',
        handler: () => alert('Action triggered!'),
      },
    });
  }

  addAutoDismiss() {
    this.store.add({
      kind: 'info',
      title: 'Auto-dismissing notification',
      detail: 'This will disappear after 3 seconds.',
      autoDismissMs: 3000,
    });
  }

  clearAll() {
    this.store.notifications().forEach((n) => this.store.dismiss(n.id));
  }
}

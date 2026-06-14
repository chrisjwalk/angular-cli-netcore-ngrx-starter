import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationStore } from '@myorg/shared';
import { HlmButton, HlmSeparator } from '@myorg/spartan';

@Component({
  imports: [HlmButton, HlmSeparator],
  template: `
    <div class="p-8 max-w-lg flex flex-col gap-4">
      <h1 class="text-2xl font-bold m-0">🛠 Debug Tools</h1>
      <p class="text-sm text-neutral-500 m-0">
        Not linked from the nav. Use to test features during development.
      </p>

      <hr hlmSeparator />

      <h2 class="text-base font-semibold m-0">Notifications</h2>

      <div class="flex flex-wrap gap-2">
        <button hlmButton variant="outline" (click)="addInfo()">Add info</button>
        <button hlmButton variant="outline" (click)="addError()">Add error</button>
        <button hlmButton variant="outline" (click)="addAuth()">Add auth</button>
        <button hlmButton variant="outline" (click)="addSwUpdate()">
          Add sw-update
        </button>
        <button hlmButton variant="outline" (click)="addWithAction()">
          Add with action
        </button>
        <button hlmButton variant="outline" (click)="addAutoDismiss()">
          Add auto-dismiss (3s)
        </button>
      </div>

      <div class="flex gap-2">
        <button hlmButton variant="outline" (click)="store.markAllRead()">
          Mark all read
        </button>
        <button hlmButton variant="destructive" (click)="clearAll()">
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

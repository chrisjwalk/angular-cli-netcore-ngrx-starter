import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import {
  AppNotification,
  NotificationKind,
  NotificationStore,
} from '../state/notification.store';

const KIND_ICON: Record<NotificationKind, string> = {
  'sw-update': 'system_update',
  auth: 'account_circle',
  error: 'error_outline',
  info: 'notifications',
};

@Component({
  imports: [DatePipe, MatButton, MatIcon, MatIconButton],
  selector: 'lib-notification-list',
  template: `
    <div
      class="w-full min-h-[200px] max-h-[70vh] flex flex-col bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-2xl rounded overflow-hidden"
    >
      <div
        class="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-600"
      >
        <h2 class="text-base font-medium m-0">Notifications</h2>
        @if (store.unreadCount() > 0) {
          <button mat-button (click)="store.markAllRead()">
            Mark all read
          </button>
        }
      </div>

      <div class="overflow-y-auto flex-1">
        @for (n of store.notifications(); track n.id) {
          <div
            class="flex gap-3 p-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0 border-l-4"
            [class]="!n.read ? 'border-l-blue-500' : 'border-l-transparent'"
          >
            <mat-icon class="shrink-0 mt-0.5 text-neutral-500">
              {{ iconFor(n.kind) }}
            </mat-icon>

            <div class="flex-1 min-w-0">
              <p
                class="text-sm m-0 leading-tight"
                [class.font-semibold]="!n.read"
              >
                {{ n.title }}
              </p>
              @if (n.detail) {
                <p
                  class="text-xs text-neutral-500 dark:text-neutral-400 m-0 mt-0.5"
                >
                  {{ n.detail }}
                </p>
              }
              <p class="text-xs text-neutral-400 m-0 mt-1">
                {{ n.createdAt | date: 'short' }}
              </p>
            </div>

            <div class="flex flex-col gap-1 shrink-0 items-end">
              @if (n.action) {
                <button mat-button color="primary" (click)="runAction(n)">
                  {{ n.action.label }}
                </button>
              }
              <button
                mat-icon-button
                (click)="store.dismiss(n.id)"
                [attr.aria-label]="'Dismiss: ' + n.title"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        } @empty {
          <p class="text-sm text-neutral-500 text-center py-8 m-0">
            No notifications
          </p>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationList {
  readonly store = inject(NotificationStore);

  // MAT_BOTTOM_SHEET_DATA is optional — component works both in overlay and bottom sheet
  readonly bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });

  iconFor(kind: NotificationKind): string {
    return KIND_ICON[kind] ?? 'notifications';
  }

  runAction(n: AppNotification): void {
    n.action?.handler();
    this.store.markRead(n.id);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CheckCircle,
  Download,
  Info,
  Network,
  LucideAngularModule,
  type LucideIconData,
} from 'lucide-angular';

const ICON_MAP: Record<string, LucideIconData> = {
  check_circle: CheckCircle,
  get_app: Download,
  hub: Network,
  info: Info,
};

@Component({
  imports: [RouterLink, LucideAngularModule],
  selector: 'lib-sidenav-list-item',
  template: `
    <a
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-on-surface-variant no-underline transition-colors hover:bg-surface-container hover:text-on-surface"
      [routerLink]="routerLink()"
      (click)="navigate.emit()"
    >
      <lucide-icon [name]="resolvedIcon()" class="h-5 w-5 shrink-0" />
      <div class="flex flex-col overflow-hidden">
        <span class="text-base font-medium leading-snug text-on-surface">
          <ng-content />
        </span>
        <span class="truncate text-sm text-on-surface-variant">
          {{ hint() }}
        </span>
      </div>
    </a>
  `,
  host: {
    'data-testid': 'lib-sidenav-list-item',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListItem {
  icon = input<string>('');
  hint = input<string>('');
  routerLink = input<string | unknown[]>('/');

  navigate = output();

  readonly resolvedIcon = computed(() => ICON_MAP[this.icon()] ?? Info);
}

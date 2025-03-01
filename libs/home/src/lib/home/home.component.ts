import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarComponent,
} from '@myorg/shared';
import { signalState } from '@ngrx/signals';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  imports: [MarkdownComponent, PageContainerComponent, PageToolbarComponent],
  selector: 'lib-home',
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <div
        class="bg-white/95 dark:bg-neutral-700 p-4 rounded flex flex-col shadow"
      >
        <markdown data-testid="page-markdown" [src]="state.src()" />
      </div>
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-home',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  readonly layoutStore = inject(LayoutStore);
  readonly state = signalState({ src: '/assets/home.component.md' });

  ngOnInit() {
    this.layoutStore.setTitle('Home');
  }
}

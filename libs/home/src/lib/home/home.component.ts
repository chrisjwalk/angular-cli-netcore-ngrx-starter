import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarComponent,
  SidenavComponent,
} from '@myorg/shared';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MarkdownComponent,
    MatCardModule,
    PageContainerComponent,
    PageToolbarComponent,
    SidenavComponent,
  ],
  selector: 'lib-home',
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <mat-card>
        <mat-card-content>
          <markdown id="page-markdown" src="/assets/home.component.md" />
        </mat-card-content>
      </mat-card>
    </lib-page-container>
  `,
  styles: [
    `
      ::ng-deep {
        pre {
          @apply p-4 overflow-auto rounded border text-sm;
          @apply border-neutral-900 bg-neutral-50;

          @media (prefers-color-scheme: dark) {
            @apply bg-neutral-900 border-neutral-50;
          }
        }

        blockquote {
          @apply py-0.5 px-4 mx-0 my-3 border-l-8 rounded;
          @apply border-neutral-900 bg-neutral-50;

          @media (prefers-color-scheme: dark) {
            @apply bg-neutral-900 border-neutral-50;
          }
        }

        code {
          @apply py-0.5 px-1;
          @apply bg-neutral-50;

          @media (prefers-color-scheme: dark) {
            @apply bg-neutral-900;
          }
        }

        h1 {
          @apply text-3xl font-bold my-5 md:text-4xl;
        }

        h2 {
          @apply text-2xl font-bold mb-4 mt-8 md:text-3xl;
        }

        h3 {
          @apply text-xl font-bold my-3 md:text-2xl;
        }

        h4 {
          @apply text-lg font-bold my-2 md:text-lg;
        }

        p {
          @apply my-3;
        }

        ul {
          @apply list-disc pl-10;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  layoutStore = inject(LayoutStore);

  @HostBinding('attr.data-testid') get testId() {
    return 'lib-home';
  }

  ngOnInit() {
    this.layoutStore.setTitle('Home');
  }
}

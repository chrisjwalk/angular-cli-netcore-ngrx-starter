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
  styleUrls: ['./home.component.scss'],
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

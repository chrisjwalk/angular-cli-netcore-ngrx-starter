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
  LayoutService,
  PageContainerComponent,
  PageToolbarComponent,
  SidenavComponent,
} from '@myorg/shared';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    MatCardModule,
    PageContainerComponent,
    PageToolbarComponent,
    SidenavComponent,
  ],
  selector: 'lib-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  layoutService = inject(LayoutService);

  @HostBinding('attr.data-testid') get testId() {
    return 'lib-home';
  }

  ngOnInit() {
    this.layoutService.setTitle('Home');
  }
}

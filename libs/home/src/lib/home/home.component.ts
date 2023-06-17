import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageContainerComponent } from '@myorg/common';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { LayoutFacade, SidenavComponent } from '@myorg/shared';
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
  @HostBinding('attr.data-testid') get testId() {
    return 'lib-home';
  }

  constructor(public layoutFacade: LayoutFacade) {}

  ngOnInit() {
    this.layoutFacade.setTitle('Home');
  }
}

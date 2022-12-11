import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageContainerComponent } from '@myorg/common';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { MarkdownModule } from 'ngx-markdown';

import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { LayoutFacade } from '../../store/facades';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(public layoutFacade: LayoutFacade) {}
}

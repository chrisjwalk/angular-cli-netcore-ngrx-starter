import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageContainerComponent } from '@myorg/common';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { Store, select } from '@ngrx/store';
import { MarkdownModule } from 'ngx-markdown';
import { Observable } from 'rxjs';

import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import * as layoutActions from '../../store/actions';
import * as fromRoot from '../../store/reducers';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title$: Observable<string>;

  constructor(private store: Store<fromRoot.State>) {
    this.store.dispatch(layoutActions.setTitle({ title: 'App Home' }));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
  }
}

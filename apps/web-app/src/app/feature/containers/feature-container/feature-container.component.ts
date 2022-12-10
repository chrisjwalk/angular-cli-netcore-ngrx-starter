import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageContainerComponent } from '@myorg/common';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { PageToolbarButtonComponent } from '@myorg/common/page-toolbar-button';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as layoutActions from '../../../core/store/actions';
import * as fromRoot from '../../../core/store/reducers';
import { FeatureComponentComponent } from '../../components/feature-component/feature-component.component';
import * as featureActions from '../../store/actions';
import * as fromFeature from '../../store/reducers';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
    FeatureComponentComponent,
  ],
  selector: 'app-feature-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-container.component.html',
  styleUrls: ['./feature-container.component.scss'],
})
export class FeatureContainerComponent {
  count$: Observable<number>;
  title$: Observable<string>;
  constructor(private store: Store<fromRoot.State>) {
    this.store.dispatch(
      layoutActions.setTitle({ title: 'Lazy Loaded Feature' }),
    );
    this.count$ = this.store.pipe(select(fromFeature.getCount));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
  }

  incrementCount() {
    this.store.dispatch(featureActions.incrementCount());
  }

  decrementCount() {
    this.store.dispatch(featureActions.decrementCount());
  }

  setCount(count: number) {
    this.store.dispatch(featureActions.setCount({ count }));
  }
}

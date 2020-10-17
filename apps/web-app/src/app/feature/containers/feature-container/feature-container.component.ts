import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as layoutActions from '../../../core/store/actions';
import * as fromRoot from '../../../core/store/reducers';
import * as featureActions from '../../store/actions';
import * as fromFeature from '../../store/reducers';

@Component({
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

  setCount(count: string) {
    this.store.dispatch(featureActions.setCount({ count: +count }));
  }
}

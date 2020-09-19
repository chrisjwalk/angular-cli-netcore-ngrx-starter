import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as layoutActions from '../../store/actions';
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title$: Observable<string>;

  constructor(private store: Store<fromRoot.State>) {
    this.store.dispatch(layoutActions.setTitle({ title: 'App Home' }));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
  }

  ngOnInit() {}
}

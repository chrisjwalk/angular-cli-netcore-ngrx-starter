import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/core/store/reducers';
import * as layoutActions from 'app/core/store/actions';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) {
    this.store.dispatch(new layoutActions.SetTitle('App Home'));
  }

  ngOnInit() {

  }

}

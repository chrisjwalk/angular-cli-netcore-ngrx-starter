import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RouterStateUrl } from 'app/core/store/reducers';

export const NAVIGATION = ROUTER_NAVIGATION;

export enum RouterActionTypes {
  GO = '[Router] Go',
  BACK = '[Router] Back',
  FORWARD = '[Router] Forward',
}

export class RouterNavigation implements Action {
  readonly type = ROUTER_NAVIGATION;

  constructor(
    public payload: {
      event: any;
      routerState: RouterStateUrl;
    },
  ) {}
}

export class Go implements Action {
  readonly type = RouterActionTypes.GO;

  constructor(
    public payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
    },
  ) {}
}

export class Back implements Action {
  readonly type = RouterActionTypes.BACK;
}

export class Forward implements Action {
  readonly type = RouterActionTypes.FORWARD;
}

export type RouterActions = Go | Back | Forward;

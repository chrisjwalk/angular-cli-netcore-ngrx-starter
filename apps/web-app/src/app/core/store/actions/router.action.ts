import { NavigationExtras } from '@angular/router';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { createAction, props } from '@ngrx/store';

import { RouterStateUrl } from 'app/core/store/reducers';

export const NAVIGATION = ROUTER_NAVIGATION;

export const routerNavigation = createAction(
  ROUTER_NAVIGATION,
  props<{
    event: any;
    routerState: RouterStateUrl;
  }>(),
);

export const go = createAction(
  '[Router] Go',
  props<{
    path: any[];
    query?: object;
    extras?: NavigationExtras;
  }>(),
);

export const back = createAction('[Router] Back');

export const forward = createAction('[Router] Forward');

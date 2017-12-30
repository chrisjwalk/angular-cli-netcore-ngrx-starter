import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  OpenSidenav = '[Layout] Open Sidenav',
  CloseSidenav = '[Layout] Close Sidenav',
  ToggleSidenav = '[Layout] Toggle Sidenav',
  SetTitle = '[Layout] Set Title',
}

export class OpenSidenav implements Action {
  readonly type = LayoutActionTypes.OpenSidenav;
}

export class CloseSidenav implements Action {
  readonly type = LayoutActionTypes.CloseSidenav;
}
export class ToggleSidenav implements Action {
    readonly type = LayoutActionTypes.ToggleSidenav;
  }

export class SetTitle implements Action {
    readonly type = LayoutActionTypes.SetTitle;
    constructor(public payload: string) { }
  }

export type LayoutActions = OpenSidenav | CloseSidenav | ToggleSidenav | SetTitle;

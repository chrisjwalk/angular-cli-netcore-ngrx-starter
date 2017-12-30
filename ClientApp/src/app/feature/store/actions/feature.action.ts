import { Action } from '@ngrx/store';

export enum FeatureActionTypes {
    SetCount = '[Feature] Set Count',
    IncrementCount = '[Feature] Increment Count'
}

export class SetCount implements Action {
    readonly type = FeatureActionTypes.SetCount;

    constructor(public payload: number) { }
}

export class IncrementCount implements Action {
    readonly type = FeatureActionTypes.IncrementCount;
}

export type FeatureActions = SetCount | IncrementCount;

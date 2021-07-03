import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '../../../core/store/reducers';
import * as fromFeature from './feature.reducer';

export interface FeatureState {
    feature: fromFeature.State;
}

export interface State extends fromRoot.State {
    feature: FeatureState;
}
export const reducers = {
    feature: fromFeature.reducer,
  };

export const getFeatureState = createFeatureSelector<FeatureState>('lazyFeature');

export const getFeatureEntitiesState = createSelector(
    getFeatureState,
    state => state.feature,
);

export const getCount = createSelector(
    getFeatureEntitiesState,
    fromFeature.getCount,
  );

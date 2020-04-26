import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromFeature from 'app/feature/store/reducers/feature.reducer';
import * as fromRoot from 'app/core/store/reducers';

export interface FeatureState {
    feature: fromFeature.State;
}

export interface State extends fromRoot.State {
    feature: FeatureState;
}
export const reducers = {
    feature: fromFeature.reducer
  };

export const getFeatureState = createFeatureSelector<FeatureState>('lazyFeature');

export const getFeatureEntitiesState = createSelector(
    getFeatureState,
    state => state.feature
);

export const getCount = createSelector(
    getFeatureEntitiesState,
    fromFeature.getCount
  );

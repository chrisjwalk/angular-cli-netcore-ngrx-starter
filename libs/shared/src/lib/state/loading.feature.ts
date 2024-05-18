import { signalStoreFeature, withState } from '@ngrx/signals';

export type LoadingState = {
  loading: boolean;
  error: unknown;
};

export const loadingInitialState = { loading: null, error: null };

export function withLoadingFeature() {
  return signalStoreFeature(withState<LoadingState>(loadingInitialState));
}

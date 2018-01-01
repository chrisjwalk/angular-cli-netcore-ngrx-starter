import { FeatureActions, FeatureActionTypes } from 'app/feature/store/actions';

export interface State {
    count: number;
}
const initialState: State = {
    count: 0
};
export function reducer(
    state = initialState,
    action: FeatureActions
): State {
    switch (action.type) {
        case FeatureActionTypes.SetCount: {
            return {
                ...state,
                count: action.payload,
            };
        }
        case FeatureActionTypes.IncrementCount: {
            return {
                ...state,
                count: state.count + 1,
            };
        }
        case FeatureActionTypes.DecrementCount: {
            return {
                ...state,
                count: state.count - 1,
            };
        }
        default: {
            return state;
        }
    }
}

export const getCount = (state: State) => state.count;

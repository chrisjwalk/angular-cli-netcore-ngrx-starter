import { LayoutActionTypes, LayoutActions } from 'app/core/store/actions';

export interface State {
  showSidenav: boolean;
  title: string;
}

const initialState: State = {
  showSidenav: false,
  title: 'Home'
};

export function reducer(
  state: State = initialState,
  action: LayoutActions
): State {
  switch (action.type) {
    case LayoutActionTypes.CloseSidenav: {
      return {
        ...state,
        showSidenav: false,
      };
    }
    case LayoutActionTypes.OpenSidenav: {
      return {
        ...state,
        showSidenav: true,
      };
    }
    case LayoutActionTypes.ToggleSidenav: {
        return {
          ...state,
          showSidenav: !state.showSidenav,
        };
      }
    case LayoutActionTypes.SetTitle: {
        return {
          ...state,
          title: action.payload,
        };
      }
    default:
      return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getTitle = (state: State) => state.title;

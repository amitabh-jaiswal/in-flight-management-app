import { initialLoadingState, LoadingState } from '../state/loading.state';
import { LoadingActions, LoadingAction } from '../actions/loading.action';

export const loadingReducer = (state = initialLoadingState, action: LoadingActions): LoadingState => {
  switch (action.type) {
    case LoadingAction.AUTH:
      return {
        ...state,
        auth: action.payload
      };
    default:
      return state;
  }
}

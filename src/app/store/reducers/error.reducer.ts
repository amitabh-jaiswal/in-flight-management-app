import { initialGlobalErrorState, ErrorState } from '../state/error.state';
import { ErrorAction, ErrorActions } from '../actions/error.action';

export const errorReducer = (state = initialGlobalErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case ErrorActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

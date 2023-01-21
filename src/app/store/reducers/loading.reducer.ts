import { initialLoadingState, LoadingState } from '../state/loading.state';
import { LoadingActions, LoadingAction } from '../actions/loading.action';

export const loadingReducer = (state = initialLoadingState, action: LoadingActions): LoadingState => {
  switch (action.type) {
    case LoadingAction.AUTH:
      return {
        ...state,
        auth: action.payload
      };
    case LoadingAction.ADD_LOADER:
      return {
        ...state,
        loaders: [...state.loaders, action.payload],
        totalLoaders: state.totalLoaders + 1,
        isLoading: state.loaders.length === 0 ? false : true
      };
    case LoadingAction.REMOVE_LOADER:
      let loaders = Object.assign({}, state.loaders);
      let count = state.totalLoaders;
      const index = loaders.findIndex((loader) => loader.id === action.payload);
      if (index !== -1) {
        loaders.splice(index, 1);
        count -= 1;
      }
      return {
        ...state,
        loaders: loaders,
        totalLoaders: count,
        isLoading: state.loaders.length === 0 ? false : true
      };
    case LoadingAction.TOGGLE_LOADER:
      return {
        ...state,
        isLoading: action.payload.isLoading,
        message: action.payload.message
      }
    default:
      return state;
  }
}

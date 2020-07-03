import { initialUserState, UserState } from '../state/user.state';
import { AuthActions, AuthAction } from '../actions/auth.actions';

export const AuthReducer = (state = initialUserState, action: AuthActions): UserState => {
  switch (action.type) {
    case AuthAction.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true
      };
    case AuthAction.LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false
      };
    default:
      return state;
  }
};

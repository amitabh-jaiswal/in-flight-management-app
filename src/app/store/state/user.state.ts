import { LoggedInUser, User } from '../../models/user.model';

export interface UserState {
  user: User | LoggedInUser;
  isLoggedIn: boolean;
}

export const initialUserState: UserState = {
  user: null,
  isLoggedIn: false
};

import { User } from '../../models/user.model';

export interface UserState {
  user: User;
  isLoggedIn: boolean;
}

export const initialUserState: UserState = {
  user: null,
  isLoggedIn: false
};

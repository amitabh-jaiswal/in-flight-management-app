import { Action } from '@ngrx/store';
import { AuthRequest } from 'src/app/models/auth-request';
import { User } from 'src/app/models/user.model';

export enum AuthAction {
  LOGIN_START = '[Auth] Login Start',
  SIGN_UP_START = '[Auth] Signup Start',
  AUTHENTICATE_SUCCESS = '[Auth] Login Success',
  AUTHENTICATE_FAIL = '[Auth] Login Fail',
  AUTO_LOGIN = '[Auth] Auto Login',
  LOGOUT = '[Auth] Logout'
}

export class LoginStart implements Action {
  readonly type = AuthAction.LOGIN_START;
  constructor(public payload: AuthRequest) { }
}

export class SignUpStart implements Action {
  readonly type = AuthAction.SIGN_UP_START;
  constructor(public payload: AuthRequest) { }
}

export class AuthenticateSuccess implements Action {
  readonly type = AuthAction.AUTHENTICATE_SUCCESS;
  constructor(public payload: { user: User, redirect: boolean }) { }
}

export class AuthenticateFail implements Action {
  readonly type = AuthAction.AUTHENTICATE_FAIL;
  constructor(public payload: string) { }
}

export class AutoLogin implements Action {
  readonly type = AuthAction.AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = AuthAction.LOGOUT;
}

export type AuthActions = LoginStart | SignUpStart | AuthenticateSuccess
  | AuthenticateFail | AutoLogin | Logout;

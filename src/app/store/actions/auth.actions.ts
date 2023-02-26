import { Action } from '@ngrx/store';
import { AuthRequest } from 'src/app/models/auth-request';
import { AuthRequestV2 } from 'src/app/models/auth-request-v2.model';
import { LoggedInUser, User } from 'src/app/models/user.model';

export enum AuthAction {
  LOGIN_START = '[Auth] Login Start',
  LOGIN_V2_START = '[Auth] Login V2 Start',
  SIGN_UP_START = '[Auth] Signup Start',
  SIGN_UP_START_V2 = '[Auth] V2 Signup Start',
  AUTHENTICATE_SUCCESS = '[Auth] Login Success',
  AUTHENTICATE_FAIL = '[Auth] Login Fail',
  AUTO_LOGIN = '[Auth] Auto Login',
  LOGOUT = '[Auth] Logout'
}

export class LoginStart implements Action {
  readonly type = AuthAction.LOGIN_START;
  constructor(public payload: AuthRequest) { }
}
export class LoginV2Start implements Action {
  readonly type = AuthAction.LOGIN_START;
  constructor(public payload: AuthRequest) { }
}

export class SignUpStart implements Action {
  readonly type = AuthAction.SIGN_UP_START;
  constructor(public payload: AuthRequest) { }
}

export class SignupV2Start implements Action {
  readonly type = AuthAction.SIGN_UP_START_V2;
  constructor(public payload: AuthRequestV2) { }
}

export class AuthenticateSuccess implements Action {
  readonly type = AuthAction.AUTHENTICATE_SUCCESS;
  constructor(public payload: { user: User | LoggedInUser, redirect: boolean, path?: string }) { }
}

export class AuthenticateFail implements Action {
  readonly type = AuthAction.AUTHENTICATE_FAIL;
  constructor(public payload: string) { }
}

export class AutoLogin implements Action {
  readonly type = AuthAction.AUTO_LOGIN;
  constructor(public payload?: { redirectPath: string }) { }
}

export class Logout implements Action {
  readonly type = AuthAction.LOGOUT;
}

export type AuthActions = LoginStart | LoginV2Start | SignUpStart | SignupV2Start | AuthenticateSuccess
  | AuthenticateFail | AutoLogin | Logout;

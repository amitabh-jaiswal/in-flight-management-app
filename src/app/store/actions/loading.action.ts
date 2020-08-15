export enum LoadingAction {
  AUTH = '[Loading] Auth Loader'
}

export class AuthLoader {
  readonly type = LoadingAction.AUTH;
  constructor(public payload: boolean) { }
}

export type LoadingActions = AuthLoader;

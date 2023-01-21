import { LoaderDetails } from "../state/loading.state";

export enum LoadingAction {
  AUTH = '[Loading] Auth Loader',
  ADD_LOADER = '[Loading] Add Loader',
  REMOVE_LOADER = '[Loading] Remove Loader',
  COMPLETE_LOADER = '[Loading] Complete Loader',
  TOGGLE_LOADER = '[Loading] Toggle Loader'
}

export class AuthLoader {
  readonly type = LoadingAction.AUTH;
  constructor(public payload: boolean) { }
}

export class AddLoader {
  readonly type = LoadingAction.ADD_LOADER;
  constructor(public payload: LoaderDetails) { }
}

export class RemoveLoader {
  readonly type = LoadingAction.REMOVE_LOADER;
  constructor(public payload: number) { }
}

export class CompleteLoader {
  readonly type = LoadingAction.COMPLETE_LOADER;
  constructor(public payload: number) { }
}

export class ToggleLoader {
  readonly type = LoadingAction.TOGGLE_LOADER;
  constructor(public payload: { isLoading: boolean, message?: string }) { }
}

export type LoadingActions = AuthLoader | AddLoader | RemoveLoader | CompleteLoader | ToggleLoader;

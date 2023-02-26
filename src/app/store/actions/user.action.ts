import { Action } from "@ngrx/store";
import { AuthTokenResponse } from "src/app/models/auth-response-v2.model";

export enum AccountAction {
  LOAD_DETAILS = '[Account] Get Account Details'
}

export class GetAccountDetails implements Action {
  readonly type = AccountAction.LOAD_DETAILS;
  constructor(public payload: AuthTokenResponse, public redirect: boolean, public redirectPath?: string) { }
}

export type AccountActions = GetAccountDetails;

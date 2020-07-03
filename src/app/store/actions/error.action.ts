import { Action } from '@ngrx/store';
import { Notification } from 'src/app/models/notification.model';

export enum ErrorActions {
  HTTP_ERROR = '[Error] Http Error',
  CLEAR_ERROR = '[Error] Clear Error'
}

export class HttpError implements Action {
  readonly type = ErrorActions.HTTP_ERROR;
  constructor(public payload: Notification) { }
}

export class ClearError implements Action {
  readonly type = ErrorActions.CLEAR_ERROR;
}

export type ErrorAction = HttpError | ClearError;

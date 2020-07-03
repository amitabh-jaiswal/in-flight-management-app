import { Action } from '@ngrx/store';
import { Flight } from 'src/app/models/flight.model';

export enum FlightActions {
  FETCH_FLIGHT_DETAILS = '[Flight] Fetch Flight Details',
  UPDATE_FLIGHT_DETAILS = '[Flight] Update Flight Deatils',
  ASSIGN_FLIGHT_DETAILS = '[Flight] Assign Flight Details',
  CLEAR_FLIGHT_DETAILS = '[Flight] Clear Flight Details',
  UPDATE_SUCCESSFULL = '[Flight] Update Flight Details Successfull',
  ERROR = '[Flight] Flight Error'
}

export class FetchFlightDetails implements Action {
  readonly type = FlightActions.FETCH_FLIGHT_DETAILS;
  constructor(public payload: number) { }
}

export class UpdateFlightDetails implements Action {
  readonly type = FlightActions.UPDATE_FLIGHT_DETAILS;
  constructor(public payload: Flight) { }
}

export class UpdateSuccessfull implements Action {
  readonly type = FlightActions.UPDATE_SUCCESSFULL;
  constructor(public payload: Flight) { }
}

export class AssignFlightDetails implements Action {
  readonly type = FlightActions.ASSIGN_FLIGHT_DETAILS;
  constructor(public payload: Flight) { }
}

export class ClearFlightDetails implements Action {
  readonly type = FlightActions.CLEAR_FLIGHT_DETAILS;
}

export class Error implements Action {
  readonly type = FlightActions.ERROR;
  constructor(public payload: string) { }
}

export type FlightAction = FetchFlightDetails | UpdateFlightDetails | AssignFlightDetails
  | ClearFlightDetails | UpdateSuccessfull | Error;

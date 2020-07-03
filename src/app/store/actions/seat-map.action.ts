import { Action } from '@ngrx/store';
import { SeatMap } from 'src/app/models/seat-map.model';

export enum SeatMapAction {
  FETCH_SELECTED_FLIGHT_SEATMAP = '[Flight Seat Map] Fetch Flight Seat Map',
  ASSIGN_FLIGHT_SEATMAP = '[Flight Seat Map] Assign Flight Seat Map',
  UPDATE_SEAT_MAP = '[Flight Seat Map] Update Flight Seat Map',
  CLEAR_FLIGHT_SEAT_MAP = '[Flight Seat Map] Clear Flight Seat Map'
}

export class FetchFlightSeatMap implements Action {
  readonly type = SeatMapAction.FETCH_SELECTED_FLIGHT_SEATMAP;
  constructor(public payload: number) { }
}

export class AssignFlightSeatMap implements Action {
  readonly type = SeatMapAction.ASSIGN_FLIGHT_SEATMAP;
  constructor(public payload: SeatMap) { }
}

export class UpdateSeatMap implements Action {
  readonly type = SeatMapAction.UPDATE_SEAT_MAP;
  constructor(public payload: SeatMap) { }
}

export class ClearFlightSeatMap implements Action {
  readonly type = SeatMapAction.CLEAR_FLIGHT_SEAT_MAP;
}

export type SeatMapActions = FetchFlightSeatMap | ClearFlightSeatMap | AssignFlightSeatMap | UpdateSeatMap;

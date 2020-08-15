import { UserState } from './user.state';
import { FlightState } from './flight.state';
import { ErrorState } from './error.state';
import { SeatMapState } from './seat-map.state';
import { LoadingState, initialLoadingState } from './loading.state';

export interface AppState {
  user: UserState;
  selectedFlight: FlightState;
  selectedFlightSeatMap: SeatMapState;
  error: ErrorState;
  loading: LoadingState;
}

export const initialAppState: AppState = {
  user: null,
  selectedFlight: null,
  selectedFlightSeatMap: null,
  error: null,
  loading: initialLoadingState
};

import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { AuthReducer } from '../reducers/auth.reducer';
import { flightReducer } from './flight.reducer';
import { errorReducer } from './error.reducer';
import { seatMapReducer } from './seat-map.reducer';
import { loadingReducer } from './loading.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  user: AuthReducer,
  selectedFlight: flightReducer,
  selectedFlightSeatMap: seatMapReducer,
  error: errorReducer,
  loading: loadingReducer
};

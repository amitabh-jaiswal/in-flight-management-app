import { initalFlightState, FlightState } from '../state/flight.state';
import { FlightAction, FlightActions } from '../actions/flight.action';

export const flightReducer = (state = initalFlightState, action: FlightAction): FlightState => {
  switch (action.type) {
    case FlightActions.ASSIGN_FLIGHT_DETAILS:
      return {
        ...state,
        flightDetails: action.payload
      };
    case FlightActions.CLEAR_FLIGHT_DETAILS:
      return {
        ...state,
        flightDetails: null
      };
    default:
      return state;
  }
};

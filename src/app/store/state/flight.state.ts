import { Flight } from 'src/app/models/flight.model';

export interface FlightState {
  flightDetails: Flight;
}

export const initalFlightState: FlightState = {
  flightDetails: null
};

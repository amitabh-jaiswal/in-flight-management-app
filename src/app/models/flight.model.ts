import { Airport } from './airport.model';
import { AncillaryServices } from './ancillary-services.model';

export class Flight {
  id: string;
  flightNumber: number;
  departureAirport: Airport;
  arrivalAirport: Airport;
  seatMapId: number;
  depScheduled: Date;
  arrScheduled: Date;
  flightStatus: string;
  operatingAirline: string;
  minutesToScheduledFlightDeparture: number;
  ancillaryServices: AncillaryServices;
}

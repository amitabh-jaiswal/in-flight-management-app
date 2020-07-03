import { Cabin } from './cabin.model';

export class SeatMap {
  id: number;
  flightNumber: number;
  departureAirport: string;
  arrivalAirport: string;
  operatingAirline: string;
  cabins: Cabin[];
}

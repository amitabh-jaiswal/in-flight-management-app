import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScheduledFlight } from '../models/scheduled-flight.model';
import { FLIGHT_DATA } from '../utilities/url';
import { Observable } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) { }

  getScheduledFlights(): Observable<ScheduledFlight[]> {
    return this.http.get<ScheduledFlight[]>(FLIGHT_DATA.SCHEDULED_API);
  }

  getFlightInfo(flightId: number): Observable<Flight> {
    return this.http.get<Flight>(FLIGHT_DATA.FLIGHT_INFO_API + flightId);
  }

  updateFlightInfo(flight: Flight): Observable<Flight> {
    return this.http.patch<Flight>(FLIGHT_DATA.FLIGHT_INFO_API + flight.id, flight);
  }

}

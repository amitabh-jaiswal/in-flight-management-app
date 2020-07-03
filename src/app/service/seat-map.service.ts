import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeatMap } from '../models/seat-map.model';
import { FLIGHT_SEAT_DATA } from '../utilities/url';

@Injectable({
  providedIn: 'root'
})
export class SeatMapService {

  constructor(private http: HttpClient) { }

  getFlightSeatMap(seatMapId: number): Observable<SeatMap> {
    return this.http.get<SeatMap>(FLIGHT_SEAT_DATA.SEAT_MAP_INFO_API + seatMapId);
  }

  updateSeatMap(payload: SeatMap): Observable<SeatMap> {
    return this.http.patch<SeatMap>(FLIGHT_SEAT_DATA.SEAT_MAP_INFO_API + payload.id, payload);
  }

}

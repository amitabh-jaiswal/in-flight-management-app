import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Passenger } from '../models/passenger.model';
import { PASSENGER_DATA } from '../utilities/url';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { SeatMapState } from '../store/state/seat-map.state';
import { map } from 'rxjs/operators';
import { SeatMap } from '../models/seat-map.model';
import { SeatRow } from '../models/seat-row.model';
import { Seat } from '../models/seat.model';
import { SeatMapService } from './seat-map.service';
import { UpdateSeatMap } from '../store/actions/seat-map.action';

@Injectable({
  providedIn: 'root'
})
export class PassengerService implements OnDestroy {

  seatMapSubs$: Subscription;
  seatMap: SeatMap;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.store.select('selectedFlightSeatMap').pipe(
      map((state: SeatMapState) => state.seatMap)
    ).subscribe((seatMap: SeatMap) => {
      if (seatMap)
        this.seatMap = seatMap;
      else
        this.seatMap = null;
    });
  }

  ngOnDestroy() {
    if (this.seatMapSubs$)
      this.seatMapSubs$.unsubscribe();
  }

  getFlightPassengers(flightId: number): Observable<Passenger[]> {
    return this.http.get<Passenger[]>(PASSENGER_DATA.FLIGHT_PASSENGERS_API + flightId);
  }

  getPassengerInfo(passengerId: number): Observable<Passenger> {
    return this.http.get<Passenger>(PASSENGER_DATA.PASSENGER_INFO_API + passengerId);
  }

  addPassenger(passenger: Passenger): Observable<Passenger> {
    const temp = this._updatePassnegerDetailsInSeat(passenger);
    if (temp)
      this.store.dispatch(new UpdateSeatMap(temp));
    return this.http.post<Passenger>(PASSENGER_DATA.PASSENGER_INFO_API, passenger);
  }

  updatePassengerInfo(passenger: Passenger, isSeatChanged?: boolean, oldSeatNumber?: string): Observable<Passenger> {
    const temp = this._updatePassnegerDetailsInSeat(passenger, isSeatChanged, oldSeatNumber);
    if (temp)
      this.store.dispatch(new UpdateSeatMap(temp));
    return this.http.patch<Passenger>(PASSENGER_DATA.PASSENGER_INFO_API + passenger.id, passenger);
  }

  private _updatePassnegerDetailsInSeat(passenger: Passenger, isSeatChanged?: boolean, oldSeatNumber?: string): SeatMap {
    const rowNumber = this._rowNumber(passenger.seatNumber);
    let oldRowNumber = 0;
    if (isSeatChanged && oldSeatNumber)
      oldRowNumber = this._rowNumber(oldSeatNumber);
    const temp = JSON.parse(JSON.stringify(this.seatMap));
    let changeFlag = false;
    let oldSeatFlag = false;
    if (temp)
      temp.cabins[0].seatRows.forEach((seatRow: SeatRow, index: number) => {
        if (seatRow.rowNumber === rowNumber) {
          seatRow.seats.forEach((seat: Seat, i: number) => {
            if (seat.seatNumber === passenger.seatNumber) {
              changeFlag = true;
              seatRow.seats[i] = this._updateSeatOfPassenger(passenger, seat);
              return;
            }
          });
          if ((isSeatChanged && oldSeatFlag && changeFlag) || (!isSeatChanged && changeFlag))
            return;
        }
        if (isSeatChanged && oldRowNumber !== 0 && seatRow.rowNumber === oldRowNumber) {
          seatRow.seats.forEach((seat: Seat, i: number) => {
            if (seat.seatNumber === oldSeatNumber) {
              seat.passengerId = null;
              seat.passengerCheckedIn = false;
              seat.passengerWithInfant = false;
              seat.passengerWithWheelChair = false;
              seat.passengersWithSpecialMeals = false;
              oldSeatFlag = true;
              seatRow.seats[i] = seat;
              return;
            }
          });
          if (isSeatChanged && oldSeatFlag && changeFlag)
            return;
        }
      });
    return temp;
  }

  private _updateSeatOfPassenger(passenger: Passenger, seat: Seat): Seat {
    const tempSeat = {
      ...seat,
      passengerId: passenger.id,
      passengerCheckedIn: passenger.checkedIn,
      passengerWithWheelChair: passenger.wheelChair,
      passengerWithInfant: passenger.withInfant,
      passengersWithSpecialMeals: this._isPassengerNeedSpecialMeal(passenger) ? true : false
    };
    return tempSeat;
  }

  private _isPassengerNeedSpecialMeal(passenger: Passenger): boolean {
    return passenger.ancillaryServices && (passenger.ancillaryServices.meals.length > 0
      || passenger.ancillaryServices.beverages.length > 0);
  }

  private _rowNumber(seatNumber: string): number {
    return seatNumber.length === 3 ? +seatNumber.substr(0, 2) : +seatNumber.charAt(0);
  }

}

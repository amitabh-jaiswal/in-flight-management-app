import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeatMap } from 'src/app/models/seat-map.model';
import { Seat } from 'src/app/models/seat.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from 'src/app/shared/bottom-sheet/bottom-sheet.component';
import { PassengerService } from 'src/app/service/passenger.service';
import { Passenger } from 'src/app/models/passenger.model';
import { SeatMapState } from 'src/app/store/state/seat-map.state';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpError } from 'src/app/store/actions/error.action';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-flight-seat-map',
  templateUrl: './flight-seat-map.component.html',
  styleUrls: ['./flight-seat-map.component.scss']
})
export class FlightSeatMapComponent implements OnInit, OnDestroy {

  showMealMap: boolean;
  flightSubs$: Subscription;
  seatMapId: number;
  seatMap: SeatMap;
  isLoading: boolean;
  loaderMessage: string;
  oldFlightId: number;

  constructor(private store: Store<AppState>, private bottomSheet: MatBottomSheet,
    private passengerService: PassengerService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showMealMap = false;
    this._isSelectedFlightChanged();
    this._fetchFlightInfo();
  }

  ngOnDestroy() {
    if (this.flightSubs$)
      this.flightSubs$.unsubscribe();
  }

  openSheet(seat: Seat) {
    this.toggleLoader(true, 'Loading....');
    let bottomRef = null;
    if (seat.passengerId) {
      let passenger = new Passenger();
      this.passengerService.getPassengerInfo(seat.passengerId).subscribe((response) => {
        passenger = response;
        this.toggleLoader(false);
        bottomRef = this.bottomSheet.open(BottomSheetComponent, {
          data: passenger
        });
      }, (error: Error) => {
        this.toggleLoader(false);
        this.store.dispatch(new HttpError(new Notification(error.message, 'HTTP_ERROR', 'ERROR')));
      });

    }
  }

  private _fetchFlightInfo() {
    this.flightSubs$ = this.store.select('selectedFlightSeatMap').pipe(
      map((flightSeatMap: SeatMapState) => flightSeatMap.seatMap)
    ).subscribe((flightDetails: SeatMap) => {
      if (flightDetails)
        this.seatMap = flightDetails;
      else
        this.seatMap = new SeatMap();
      this.isLoading = false;
      this.loaderMessage = undefined;
    });
  }

  private _isSelectedFlightChanged() {
    this._route.queryParamMap.subscribe((queryParam: ParamMap) => {
      if (queryParam) {
        const flightId = +queryParam.get('id');
        if (flightId && flightId !== this.oldFlightId) {
          this.isLoading = true;
          this.loaderMessage = 'Fetching Flight Seat Map....';
          this.oldFlightId = flightId;
        } else {
          this.isLoading = false;
          this.loaderMessage = undefined;
          this.oldFlightId = undefined;
        }
      }
    });
  }

  private toggleLoader(isLoading: boolean, message?: string) {
    this.isLoading = isLoading;
    this.loaderMessage = message;
  }
}

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

  constructor(private store: Store<AppState>, private bottomSheet: MatBottomSheet, private passengerService: PassengerService) { }

  ngOnInit(): void {
    this.showMealMap = false;
    this._fetchFlightInfo();
  }

  ngOnDestroy() {
    if (this.flightSubs$)
      this.flightSubs$.unsubscribe();
  }

  openSheet(seat: Seat) {
    let bottomRef = null;
    if (seat.passengerId) {
      let passenger = new Passenger();
      this.passengerService.getPassengerInfo(seat.passengerId).subscribe((response) => {
        passenger = response;
        bottomRef = this.bottomSheet.open(BottomSheetComponent, {
          data: passenger
        });
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
    });
  }

}

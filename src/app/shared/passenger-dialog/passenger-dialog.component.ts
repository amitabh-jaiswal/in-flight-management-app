import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Passenger } from 'src/app/models/passenger.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeatMapState } from 'src/app/store/state/seat-map.state';
import { SeatMap } from 'src/app/models/seat-map.model';
import { Seat } from 'src/app/models/seat.model';
import { SeatRow } from 'src/app/models/seat-row.model';
import { PassengerService } from 'src/app/service/passenger.service';
import { HttpError } from 'src/app/store/actions/error.action';
import { Notification } from 'src/app/models/notification.model';
import { AncillaryServices } from 'src/app/models/ancillary-services.model';
import { AddServiceDialogComponent } from 'src/app/check-in/add-service-dialog/add-service-dialog.component';
import { AddService } from 'src/app/models/add-service.model';

@Component({
  selector: 'app-passenger-dialog',
  templateUrl: './passenger-dialog.component.html',
  styleUrls: ['./passenger-dialog.component.scss']
})
export class PassengerDialogComponent implements OnInit, OnDestroy {

  wheelChair: boolean;
  withInfant: boolean;
  checkedIn: boolean;
  seats: Seat[];
  tempPassenger: Passenger;
  seatMapSubs$: Subscription;
  maxDate: Date;

  constructor(
    private dialogRef: MatDialogRef<PassengerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, passenger: Passenger, isUserAdmin: boolean, flightId?: number },
    private store: Store<AppState>,
    private passengerService: PassengerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.seats = [];
    // const currentYear = new Date().getFullYear();
    this.maxDate = new Date();
    this._getSeatRows();
    if (this.data.action === 'Update')
      this.tempPassenger = JSON.parse(JSON.stringify(this.data.passenger));
    else {
      this.tempPassenger = new Passenger();
      this.tempPassenger.bookingPNR = this._generatePNR();
      this.tempPassenger.id = this._generateId();
      this.tempPassenger.flightId = this.data.flightId;
      this.tempPassenger.ancillaryServices = new AncillaryServices();
      this.tempPassenger.ancillaryServices.meals = [];
      this.tempPassenger.ancillaryServices.beverages = [];
      this.tempPassenger.ancillaryServices.shoppingItems = [];
    }
  }

  ngOnDestroy() {
    if (this.seatMapSubs$)
      this.seatMapSubs$.unsubscribe();
  }

  actionClick(action: string) {
    if (action === 'Close')
      this.dialogRef.close({ action });
    else if (action === 'Save')
      if (this.data.action === 'Update')
        if (this.tempPassenger.seatNumber === this.data.passenger.seatNumber)
          this._updatePassenger(this.tempPassenger, false);
        else
          this._updatePassenger(this.tempPassenger, true, this.data.passenger.seatNumber);

      else
        this._addPassenger(this.tempPassenger);
  }

  editService() {
    const dialogData = new AddService(this.data.isUserAdmin, this.tempPassenger.ancillaryServices.meals,
      this.tempPassenger.ancillaryServices.beverages, this.tempPassenger.ancillaryServices.shoppingItems);
    const dialogRef = this.dialog.open(AddServiceDialogComponent, {
      data: {
        service: dialogData,
        forPassenger: true,
        newPassengerServices: this.data.isUserAdmin && this.data.action === 'Add' ? true : false
      }
    });
    dialogRef.afterClosed().subscribe((result: { action: string, result: AddService }) => {
      if (result && result.action === 'save') {
        this.tempPassenger.ancillaryServices.meals = result.result.meals;
        this.tempPassenger.ancillaryServices.beverages = result.result.beverages;
        this.tempPassenger.ancillaryServices.shoppingItems = result.result.shoppingItems;
      }
    });
  }

  private _getSeatRows() {
    this.seatMapSubs$ = this.store.select('selectedFlightSeatMap').pipe(
      map((state: SeatMapState) => state.seatMap)
    ).subscribe((seatMap: SeatMap) => {
      if (seatMap)
        seatMap.cabins[0].seatRows.forEach((seatRow: SeatRow) => {
          this.seats.push(...seatRow.seats);
        });
      else
        this.seats = [];
    });
  }

  private _updatePassenger(passenger: Passenger, isSeatChanged?: boolean, oldSeatNumber?: string) {
    this.passengerService.updatePassengerInfo(passenger, isSeatChanged, oldSeatNumber).subscribe((response: Passenger) => {
      if (response) {
        this.tempPassenger = response;
        this.store.dispatch(new HttpError(new Notification('Details Updated Successfully!!', 'HTTP_SAVE', 'SUCCESS')));
        this.dialogRef.close({ action: 'Success' });
      }
    });
  }

  private _addPassenger(passenger: Passenger) {
    console.log(passenger);
    this.passengerService.addPassenger(passenger).subscribe((response: Passenger) => {
      if (response) {
        this.tempPassenger = response;
        this.store.dispatch(new HttpError(new Notification('Passenger Added Successfully!!', 'HTTP_SAVE', 'SUCCESS')));
        this.dialogRef.close({ action: 'Success' });
      }
    });
  }

  private _generatePNR(): string {
    let pnr = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 6; i > 0; i--)
      pnr += characters[Math.floor(Math.random() * characters.length)];
    console.log(pnr);
    return pnr;
  }

  private _generateId(): number {
    return Math.floor(100000000 + Math.random() * 900000000);
  }

}

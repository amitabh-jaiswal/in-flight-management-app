import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Passenger } from 'src/app/models/passenger.model';
import { PassengerService } from 'src/app/service/passenger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { HttpError } from 'src/app/store/actions/error.action';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  passengerData: Passenger;
  changeSeat: boolean;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: Passenger,
    private passengerService: PassengerService,
    private router: Router, private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.changeSeat = false;
    this.passengerData = this.data;
  }

  save() {
    this.passengerData.checkedIn = !this.passengerData.checkedIn;
    this.passengerService.updatePassengerInfo(this.passengerData).subscribe((response: Passenger) => {
      if (response) {
        const checkinMessage = 'Check-in Successful!!';
        const undoMessage = 'Check-in Undo Successful!!';
        this.store.dispatch(new HttpError(
          new Notification(this.passengerData.checkedIn ? checkinMessage : undoMessage, 'HTTP_SUCCESS', 'SUCCESS')
        ));
        this.bottomSheetRef.dismiss();
      }
    });
  }

  showPassengerDetails() {
    this.bottomSheetRef.dismiss();
    this.router.navigate(['flight/passengers', this.passengerData.id],
      { queryParamsHandling: 'preserve', relativeTo: this.route });
  }

}

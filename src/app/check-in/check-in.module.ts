import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckInRoutingModule } from './check-in-routing.module';
import { CheckInComponent } from './check-in/check-in.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PassengerListComponent } from './passenger-list/passenger-list.component';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { AddServiceDialogComponent } from './add-service-dialog/add-service-dialog.component';
import { FlightSeatMapComponent } from './flight-seat-map/flight-seat-map.component';


@NgModule({
  declarations: [CheckInComponent, PassengerListComponent, PassengerDetailsComponent, AddServiceDialogComponent, FlightSeatMapComponent],
  imports: [
    CommonModule,
    CheckInRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class CheckInModule { }

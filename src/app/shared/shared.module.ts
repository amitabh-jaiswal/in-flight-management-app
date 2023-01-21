import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { CardComponent } from './card/card.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FlightSelectComponent } from './flight-select/flight-select.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { AncillaryServiceCardComponent } from './ancillary-service-card/ancillary-service-card.component';
import { PassengerDialogComponent } from './passenger-dialog/passenger-dialog.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    HeaderComponent,
    CardComponent,
    FlightSelectComponent,
    BottomSheetComponent,
    AncillaryServiceCardComponent,
    PassengerDialogComponent,
    LoaderComponent
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    CardComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlightSelectComponent,
    AncillaryServiceCardComponent,
    LoaderComponent
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { verticalPosition: 'top', duration: 4000 } },
    DatePipe
  ]
})
export class SharedModule {

}

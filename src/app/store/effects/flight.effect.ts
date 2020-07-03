import { Actions, ofType, Effect } from '@ngrx/effects';
import { FlightService } from 'src/app/service/flight.service';
import { FlightActions, FetchFlightDetails, AssignFlightDetails, Error, ClearFlightDetails, UpdateFlightDetails, UpdateSuccessfull } from '../actions/flight.action';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Flight } from 'src/app/models/flight.model';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchFlightSeatMap, ClearFlightSeatMap } from '../actions/seat-map.action';

@Injectable()
export class FlighEffect {

  constructor(private actions$: Actions, private flightService: FlightService, private snackbar: MatSnackBar) { }

  @Effect()
  fetchFlightDetails = this.actions$.pipe(
    ofType(FlightActions.FETCH_FLIGHT_DETAILS),
    switchMap((requestData: FetchFlightDetails) => {
      return this.flightService.getFlightInfo(requestData.payload).pipe(
        map((response: Flight) => {
          if (response)
            return new AssignFlightDetails(response);
          else
            return of(new Error('Flight Detail Does Not Exists!!'));
        }),
        catchError(error => {
          return this._handleError(error);
        })
      );
    })
  );

  @Effect()
  updateFlightDetails = this.actions$.pipe(
    ofType(FlightActions.UPDATE_FLIGHT_DETAILS),
    switchMap((requestData: UpdateFlightDetails) => {
      return this.flightService.updateFlightInfo(requestData.payload).pipe(
        map((response: Flight) => {
          if (response)
            return new UpdateSuccessfull(response);
          else
            return of(new Error('Some Error Occurred!!\n Update Failed!!!'));
        }),
        catchError(error => {
          return this._handleError(error);
        })
      );
    })
  );

  @Effect()
  updateSuccessfull = this.actions$.pipe(
    ofType(FlightActions.UPDATE_SUCCESSFULL),
    map((requestData: UpdateSuccessfull) => {
      this.snackbar.open('Flight Updated Successfully!!', '', {
        panelClass: 'success-snackbar'
      });
      return new AssignFlightDetails(requestData.payload);
    })
  );

  @Effect()
  assignFlightDetails = this.actions$.pipe(
    ofType(FlightActions.ASSIGN_FLIGHT_DETAILS),
    map((requestData: AssignFlightDetails) => {
      if (requestData.payload.seatMapId)
        return new FetchFlightSeatMap(requestData.payload.seatMapId);
      else
        return new Error('Flight Seat Map Id is not set.');
    })
  );

  @Effect()
  clearFlightDetails = this.actions$.pipe(
    ofType(FlightActions.CLEAR_FLIGHT_DETAILS),
    map((requestData: ClearFlightDetails) => {
      return new ClearFlightSeatMap();
    })
  );

  @Effect({ dispatch: false })
  error = this.actions$.pipe(
    ofType(FlightActions.ERROR),
    tap((errorData: Error) => {
      this.snackbar.open(errorData.payload, 'Close', {
        panelClass: 'error-snackbar'
      });
    })
  );

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = 'An Unknown Error Occured!';
    switch (error.status) {
      case 404:
        errorMessage = 'Flight Details Does Not Exits!';
        break;
      case 503:
        errorMessage = 'Service Unavailable!!\nPlease try again!!';
        break;
      case 0:
        errorMessage = 'Service Unavailable!!\nPlease try again!!';
    }
    return of(new Error(errorMessage));
  }

}

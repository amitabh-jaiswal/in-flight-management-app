import { Actions, ofType, Effect } from '@ngrx/effects';
import { SeatMapService } from 'src/app/service/seat-map.service';
import { SeatMapActions, SeatMapAction, FetchFlightSeatMap, AssignFlightSeatMap, UpdateSeatMap } from '../actions/seat-map.action';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SeatMap } from 'src/app/models/seat-map.model';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Notification } from 'src/app/models/notification.model';

@Injectable()
export class SeatMapEffect {

  constructor(private actions$: Actions, private seatMapService: SeatMapService) { }

  @Effect()
  fetchSeatMap = this.actions$.pipe(
    ofType(SeatMapAction.FETCH_SELECTED_FLIGHT_SEATMAP),
    switchMap((requestData: FetchFlightSeatMap) => {
      return this.seatMapService.getFlightSeatMap(requestData.payload).pipe(
        map((response: SeatMap) => {
          if (response)
            return new AssignFlightSeatMap(response);
          else
            return new Notification('Flight Seat Map Not Found.', 'HTTP_ERROR', 'ERROR');
        }),
        catchError((error: HttpErrorResponse) => {
          return this._handleError(error);
        })
      );
    })
  );

  @Effect()
  updateSeatMap = this.actions$.pipe(
    ofType(SeatMapAction.UPDATE_SEAT_MAP),
    switchMap((requestData: UpdateSeatMap) => {
      return this.seatMapService.updateSeatMap(requestData.payload).pipe(
        map((response: SeatMap) => {
          if (response)
            return new AssignFlightSeatMap(response);
          else
            return new Notification('An Unknown Error Occured.', 'HTTP_ERROR', 'ERROR');
        }),
        catchError((error: HttpErrorResponse) => {
          return this._handleError(error);
        })
      );
    })
  );

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = 'An Unknown Error Occured!';
    switch (error.status) {
      case 404:
        errorMessage = 'Flight Seat Map Does Not Exits!';
        break;
      case 503:
        errorMessage = 'Service Unavailable!!\nPlease try again!!';
        break;
      case 0:
        errorMessage = 'Service Unavailable!!\nPlease try again!!';
    }
    return of(new Notification(errorMessage, 'HTTP_ERROR', 'ERROR'));
  }

}

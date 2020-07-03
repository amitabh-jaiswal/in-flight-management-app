import { Actions, ofType, Effect } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorActions, HttpError, ClearError } from '../actions/error.action';
import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorEffect {

  constructor(private actions$: Actions, private matSnackBar: MatSnackBar) { }

  @Effect()
  httpError = this.actions$.pipe(
    ofType(ErrorActions.HTTP_ERROR),
    switchMap((errorData: HttpError) => {
      this.matSnackBar.open(errorData.payload.message, 'Close', {
        panelClass: errorData.payload.type === 'ERROR' ? 'error-snackbar' : 'success-snackbar'
      });
      return of(new ClearError());
    })
  );


}

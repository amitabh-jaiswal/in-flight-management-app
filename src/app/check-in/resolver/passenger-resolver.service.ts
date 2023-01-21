import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Passenger } from 'src/app/models/passenger.model';
import { Observable, throwError, of } from 'rxjs';
import { PassengerService } from 'src/app/service/passenger.service';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { HttpError } from 'src/app/store/actions/error.action';
import { Notification } from 'src/app/models/notification.model';
import { ToggleLoader } from 'src/app/store/actions/loading.action';

@Injectable({
  providedIn: 'root'
})
export class PassengerResolverService implements Resolve<Passenger> {

  constructor(
    private passengerService: PassengerService,
    private store: Store<AppState>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Passenger | Observable<Passenger>
    | Promise<Passenger> {
    const passengerId = route.params.passengerId;
    return this.passengerService.getPassengerInfo(passengerId).pipe(
      map((passenger) => {
        if (passenger) {
          this.store.dispatch(new ToggleLoader({isLoading: false}));
        }
        return passenger;
      }),
      catchError((error: HttpErrorResponse) => {
        this.store.dispatch(new ToggleLoader({isLoading: false}));
        return this._handleError(error);
      })
    );
  }

  private _handleError(error: HttpErrorResponse) {
    let erroMessage = 'An Error Occured. Please try again!!';
    switch (error.status) {
      case 503:
      case 0:
        erroMessage = 'Service Unavailable. Please make sure you are connected to internet!!';
        break;
      case 404:
        erroMessage = 'Passenger Details Does Not Exists!!';
    }
    this.store.dispatch(new HttpError(new Notification(erroMessage, 'Http Error', 'ERROR', error.url)));
    return of(null);
  }
}

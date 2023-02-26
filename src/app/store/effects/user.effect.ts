import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthResponseV2 } from "src/app/models/auth-response-v2.model";
import { LoggedInUser } from "src/app/models/user.model";
import { AccountService } from "src/app/service/account.service";
import { AuthService } from "src/app/service/auth.service";
import { SnackbarService } from "src/app/service/snackbar.service";
import { AuthenticateFail, AuthenticateSuccess } from "../actions/auth.actions";
import { AccountAction, GetAccountDetails } from "../actions/user.action";

@Injectable()
export class UserEffect {

  constructor(private action$: Actions, private authService: AuthService,
    private _accountService: AccountService, private _snackbarService: SnackbarService) { }

  @Effect()
  getAccountDetails = this.action$.pipe(
    ofType(AccountAction.LOAD_DETAILS),
    switchMap((request: GetAccountDetails) => {
      return this._accountService.getDetails().pipe(
        map((response: AuthResponseV2) => {
          console.log(response);
          const user: LoggedInUser = {
            ...response,
            phone: String(response.phone),
            id: response.uid,
            isAdmin: this._isUserAdmin(response.roles)
          };
          return new AuthenticateSuccess({ user, redirect: request.redirect, path: request.redirectPath });
          // return this._handleAuthentication(+response.expiresIn, response.email, response.uuid,
          //   response.token, response.refreshToken, response);
        }),
        catchError(error => {
          console.log(error);
          return this._handleError(error);
        })
      );
    })
  );

  private _isUserAdmin(roles: string[]): boolean {
    return roles && roles.length !== 0 && (roles.includes('ADMIN') || roles.includes('FLIGHT_ADMIN'));
  }

  private _handleError(err: Error | HttpErrorResponse) {
    const message = err instanceof HttpErrorResponse ? err.error.message : err.message;
    return of(new AuthenticateFail(message));
  }
}

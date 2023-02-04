import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';

import { AuthService } from 'src/app/service/auth.service';
import { AuthAction, LoginStart, AuthenticateSuccess, AuthenticateFail, AutoLogin, SignUpStart, SignupV2Start } from '../actions/auth.actions';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { AuthResponse } from 'src/app/models/auth-response';
import { User } from 'src/app/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthLoader } from '../actions/loading.action';
import { AuthResponseV2 } from 'src/app/models/auth-response-v2.model';

@Injectable()
export class AuthEffect {

  constructor(
    private action$: Actions,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  @Effect()
  signUpStart = this.action$.pipe(
    ofType(AuthAction.SIGN_UP_START),
    switchMap((authRequest: SignUpStart) => {
      return this.authService.signup(authRequest.payload).pipe(
        tap((response: AuthResponse) => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        }),
        map((response: AuthResponse) => {
          console.log(response);
          return this._handleAuthentication(+response.expiresIn, response.email, response.localId,
            response.idToken, response.refereshToken, response);
        }),
        catchError(error => {
          console.log(error);
          return this._handleError(error);
        })
      );
    })
  );

  @Effect()
  signUpStartV2 = this.action$.pipe(
    ofType(AuthAction.SIGN_UP_START_V2),
    switchMap((authRequest: SignupV2Start) => {
      return this.authService.signupV2(authRequest.payload).pipe(
        tap((response: AuthResponseV2) => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        }),
        map((response: AuthResponseV2) => {
          console.log(response);
          return this._handleAuthentication(+response.expiresIn, response.email, response.uuid,
            response.token, response.refreshToken, response);
        }),
        catchError(error => {
          console.log(error);
          return this._handleError(error);
        })
      );
    })
  );

  @Effect()
  loginStart = this.action$.pipe(
    ofType(AuthAction.LOGIN_START),
    switchMap((authRequest: LoginStart) => {
      return this.authService.loginV2(authRequest.payload).pipe(
        tap((response: AuthResponseV2) => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        }),
        map((response: AuthResponseV2) => {
          console.log(response);
          return this._handleAuthentication(+response.expiresIn, response.email, response.uuid,
            response.token, response.refreshToken, response);
        }),
        catchError(error => {
          console.log(error);
          return this._handleError(error);
        })
      );
    })
  );

  @Effect()
  authSuccess = this.action$.pipe(
    ofType(AuthAction.AUTHENTICATE_SUCCESS),
    map((authData: AuthenticateSuccess) => {
      if (authData.payload.redirect)
        this.router.navigate(['/flight']);
      return new AuthLoader(false);
    })
  );

  @Effect()
  authFail = this.action$.pipe(
    ofType(AuthAction.AUTHENTICATE_FAIL),
    map((authData: AuthenticateFail) => {
      this.snackbar.open(authData.payload, 'Close', {
        panelClass: 'error-snackbar'
      });
      return new AuthLoader(false);
    })
  );

  @Effect()
  autoLogin = this.action$.pipe(
    ofType(AuthAction.AUTO_LOGIN),
    map(() => {
      const loadedUser: {
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        displayName: string;
        phone: number;
        _token: string;
        _tokenExpirationDate: string;
        _refereshToken: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (loadedUser) {
        const user: User = new User(loadedUser.id, loadedUser.email, loadedUser.firstName,
          loadedUser.lastName, loadedUser.displayName, loadedUser._token,
          new Date(loadedUser._tokenExpirationDate), loadedUser._refereshToken,
          this._isUserAdmin(loadedUser.email), loadedUser.phone);
        if (user.token) {
          const expirationDuration =
            new Date(loadedUser._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthenticateSuccess({ user, redirect: false });
        }
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  logout = this.action$.pipe(
    ofType(AuthAction.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/login']);
    })
  );

  private _handleAuthentication(expiresIn: number, email: string, id: string, token: string, refereshToken: string, userResp: AuthResponseV2 | AuthResponse) {
    const tokenExpirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    let phone: number;
    let firstName: string;
    let lastName: string;
    if (!(userResp instanceof AuthResponse)) {
      phone = userResp.phone
      firstName = userResp.firstName;
      lastName = userResp.lastName;
    }
    const user: User = new User(id, email, firstName, lastName, null, token, tokenExpirationDate, refereshToken, this._isUserAdmin(email), phone);
    localStorage.setItem('userData', JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      _token: user.token,
      _refereshToken: user.refereshToken,
      _tokenExpirationDate: tokenExpirationDate
    }));
    return new AuthenticateSuccess({ user, redirect: true });
  }

  private _handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes.error.message || 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error)
      return of(new AuthenticateFail(errorMessage));
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email Already Exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is not correct.';
        break;
    }
    return of(new AuthenticateFail(errorMessage));
  }

  private _isUserAdmin(email: string): boolean {
    const emailName = email.split('@')[0];
    if (emailName.toLowerCase() === 'admin')
      return true;
    return false;
  }

}

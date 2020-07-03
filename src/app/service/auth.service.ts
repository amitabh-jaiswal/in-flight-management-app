import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AUTH } from '../utilities/url';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { Logout } from '../store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private store: Store<AppState>) { }

  login(requestPayload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH.SIGN_IN_API + '?key=' + environment.firebaseConfig.apiKey, requestPayload);
  }

  signup(requestPayload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH.SIGN_UP_API + '?key=' + environment.firebaseConfig.apiKey, requestPayload);
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

}

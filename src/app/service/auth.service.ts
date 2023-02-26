import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ACCOUNT, AUTH } from '../utilities/url';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { Logout } from '../store/actions/auth.actions';
import { AuthRequestV2, AuthTokenRequestV2 } from '../models/auth-request-v2.model';
import { AuthResponseV2, AuthTokenResponse } from '../models/auth-response-v2.model';
import { ConfirmResetPasswordResponse, SendEmailApiResponse } from '../models/account.dto.model';
import { EmailMode } from '../models/email-mode.enum';
import { AppCookieService } from './app-cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private store: Store<AppState>, private _cookieService: AppCookieService) { }

  login(requestPayload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH.SIGN_IN_API + '?key=' + environment.firebaseConfig.apiKey, requestPayload);
  }

  loginV2(payload: AuthRequest): Observable<AuthResponseV2> {
    let headers = new HttpHeaders();
    headers = headers.set('x-api-key', environment.xApiKey);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    console.info(JSON.stringify(headers));
    let body = new HttpParams({ encoder: new HttpUrlEncodingCodec() });
    body = body.set('email', payload.email);
    body = body.set('password', payload.password);
    return this.http.post<AuthResponseV2>(AUTH.LOGIN_V2_API, body, { headers });
  }

  sendEmail(mode: EmailMode, email: string, attachApiKey: boolean): Observable<SendEmailApiResponse> {
    let headers = new HttpHeaders();
    if (attachApiKey) {
      headers = headers.set('x-api-key', environment.xApiKey);
    }
    let queryParams = new HttpParams();
    queryParams = queryParams.append('email', email);
    return this.http.put<SendEmailApiResponse>(ACCOUNT.SEND_EMAIL(mode), {}, { headers, params: queryParams });
  }

  confirmResetPassword(code: string, password?: string): Observable<ConfirmResetPasswordResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('x-api-key', environment.xApiKey);
    const body = { code, password };
    return this.http.post<ConfirmResetPasswordResponse>(ACCOUNT.CONFIRM_RESET_EMAIL(EmailMode.RESET_PASSWORD), body, { headers });
  }

  signup(requestPayload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH.SIGN_UP_API + '?key=' + environment.firebaseConfig.apiKey, requestPayload);
  }

  signupV2(payload: AuthRequestV2): Observable<AuthTokenResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('x-api-key', environment.xApiKey);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    console.info(JSON.stringify(headers));
    let body = new HttpParams();
    body = body.set('email', payload.email);
    body = body.set('firstName', payload.firstName);
    body = body.set('lastName', payload.lastName);
    body = body.set('password', payload.password);
    body = body.set('phone', String(payload.phone));
    body = body.set('roles', payload.roles ? JSON.stringify(payload.roles) : JSON.stringify([]));
    return this.http.post<AuthTokenResponse>(AUTH.SIGN_UP_V2_API, body, { headers });
  }

  token(refreshToken?: string, email?: string, password?: string): Observable<AuthTokenResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('x-api-key', environment.xApiKey);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let body = new HttpParams();
    body = body.set('grantType', refreshToken ? 'refresh_token' : 'password');
    if (refreshToken) {
      body = body.set('refreshToken', refreshToken);
    }
    if (email && password) {
      body = body.set('email', email);
      body = body.set('password', password);
    }
    return this.http.post<AuthTokenResponse>(AUTH.TOKEN_API, body, { headers });
  }

  setLogoutTimer(expiresIn: number) {
    const expirationDate: Date = new Date(0);
    expirationDate.setUTCSeconds(expiresIn);
    const today: Date = new Date();
    const expirationDuration = Math.abs(expirationDate.getTime() - today.getTime());
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

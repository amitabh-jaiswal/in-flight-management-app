import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OtpType } from '../models/account.dto.model';
import { ApiResponse } from '../models/api-response.dto.model';
import { AuthRequestV2 } from '../models/auth-request-v2.model';
import { AuthResponseV2 } from '../models/auth-response-v2.model';
import { ACCOUNT } from '../utilities/url';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  updatePassword(newPassword: string, code: string): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    console.info(JSON.stringify(headers));
    let body = new HttpParams({ encoder: new HttpUrlEncodingCodec() });
    body = body.set('password', newPassword);
    body = body.set('code', code);
    return this.http.patch<ApiResponse>(ACCOUNT.CHANGE_PASSWORD, body, { headers, withCredentials: true });
  }

  sendOtp(otpType: OtpType, captchaToken?: string, phone?: string): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    if (phone) {
      headers = headers.set('x-api-key', environment.xApiKey);
    }
    return this.http.post<ApiResponse>(ACCOUNT.SEND_OTP, { otpType, captchaToken, phone },
      { headers, withCredentials: true });
  }

  getDetails(): Observable<AuthResponseV2> {
    return this.http.get<AuthResponseV2>(ACCOUNT.DETAILS);
  }

  signupV2(payload: AuthRequestV2): Observable<ApiResponse> {
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
    return this.http.post<ApiResponse>(ACCOUNT.SIGNUP, body, { headers });
  }
}

import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OtpType } from '../models/account.dto.model';
import { ApiResponse } from '../models/api-response.dto.model';
import { ACCOUNT } from '../utilities/url';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) { }

  updatePassword(newPassword: string, code: string): Observable<ApiResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    console.info(JSON.stringify(headers));
    let body = new HttpParams({ encoder: new HttpUrlEncodingCodec() });
    body = body.set('password', newPassword);
    body = body.set('code', code);
    return this.httpClient.patch<ApiResponse>(ACCOUNT.CHANGE_PASSWORD, body, { headers });
  }

  sendOtp(otpType: OtpType): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(ACCOUNT.SEND_OTP, { otpType });
  }
}

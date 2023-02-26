import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthTokenResponse } from '../models/auth-response-v2.model';

const COOKIE = {
  TOKEN: 'tid',
  REFRESH: 'rid'
};
@Injectable({
  providedIn: 'root'
})
export class AppCookieService {

  private _domain: string;

  constructor(private _cookieService: CookieService, @Inject(DOCUMENT) private _document: any) {
    this._domain = this._document.location.hostname;
  }

  setToken(tokenDetails: AuthTokenResponse): void {
    this.set(COOKIE.TOKEN, tokenDetails.token, tokenDetails.expiresIn);
    this.set(COOKIE.REFRESH, `${tokenDetails.expiresIn}|${tokenDetails.refreshToken}`, tokenDetails.expiresIn);
  }

  get(cookieName: string) {
    return this._cookieService.get(cookieName);
  }

  set(name: string, value: string, expiresIn?: number) {
    this._cookieService.set(name, value, expiresIn, '/', this._domain, true, 'None');
  }

  check(name: string) {
    return this._cookieService.check(name);
  }

  delete(name: string) {
    this._cookieService.delete(name, '/', this._domain, true, 'None');
  }

  getToken(): { token: string, refreshToken: string, expiresIn: number } {
    const token = this.get(COOKIE.TOKEN);
    const refreshToken = this.get(COOKIE.REFRESH);
    let rid;
    let expiresIn;
    if (refreshToken) {
      const splitToken = refreshToken.split('|');
      rid = splitToken[1];
      expiresIn = splitToken[0];
    }
    return { token, refreshToken: rid, expiresIn };
  }

  clearToken() {
    this.delete(COOKIE.REFRESH);
    this.delete(COOKIE.TOKEN);
  }
}

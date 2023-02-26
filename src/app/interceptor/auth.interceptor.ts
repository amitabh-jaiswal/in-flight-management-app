import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { map, take, exhaustMap } from 'rxjs/operators';
import { UserState } from '../store/state/user.state';
import { User } from '../models/user.model';
import { AUTH } from '../utilities/url';
import { AppCookieService } from '../service/app-cookie.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>, private _cookieService: AppCookieService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = request.url;
    if (url.indexOf(AUTH.SIGN_IN_API) !== -1 || url.indexOf(AUTH.SIGN_UP_API) !== -1)
      return next.handle(request);
    return this._addToken(request, next);
  }

  private _addToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<undefined>> {
    const { token } = this._cookieService.getToken();
    if (!token) {
      return next.handle(request);
    }
    const cloneReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(cloneReq);
    // return this.store.select('user').pipe(
    //   take(1),
    //   map((state: UserState) => state.user),
    //   exhaustMap((user: User) => {
    //     if (!user)
    //       return next.handle(request);
    //     const cloneReq = request.clone({
    //       setHeaders: {
    //         Authorization: 'Bearer ' + user.token
    //       }
    //     });
    //     return next.handle(cloneReq);
    //   })
    // );
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { take, map } from 'rxjs/operators';
import { UserState } from '../store/state/user.state';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('user').pipe(
      take(1),
      map((userState: UserState) => userState.user),
      map((user: User) => {
        const isLoggedIn = !!user;
        if (isLoggedIn)
          return this.router.createUrlTree(['/flight']);
        return true;
      })
    );
  }

}

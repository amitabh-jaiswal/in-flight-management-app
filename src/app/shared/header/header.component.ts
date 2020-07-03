import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { UserState } from 'src/app/store/state/user.state';
import { User } from 'src/app/models/user.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AutoLogin, Logout } from 'src/app/store/actions/auth.actions';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  userSubscribe: Subscription;
  isLoggedIn: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private store: Store<AppState>) { }

  ngOnInit() {
    this.isLoggedIn = false;
    this.userSubscribe = this.store.select('user').pipe(
      map((userData: UserState) => userData.user)
    ).subscribe((user: User) => {
      this.user = user;
      this.isLoggedIn = this.user ? true : false;
    });
  }

  ngOnDestroy() {
    if (this.userSubscribe)
      this.userSubscribe.unsubscribe();
  }

  logout() {
    this.store.dispatch(new Logout());
  }

}

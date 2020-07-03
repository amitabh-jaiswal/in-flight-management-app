import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatchers } from '../validators/error-state-matcher.validator';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { LoginStart } from '../store/actions/auth.actions';
import { AuthRequest } from '../models/auth-request';
import { map } from 'rxjs/operators';
import { UserState } from '../store/state/user.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  hide = true;
  matcher: ErrorStateMatchers;
  loggedSubscribe$: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.matcher = new ErrorStateMatchers();
    this._initLoginForm();
    this.loggedSubscribe$ = this.store.select('user').pipe(
      map((userData: UserState) => userData.isLoggedIn)
    ).subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn)
        this._initLoginForm();
    });
  }

  ngOnDestroy() {
    if (this.loggedSubscribe$)
      this.loggedSubscribe$.unsubscribe();
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  onSubmit() {
    if (this.loginForm.invalid)
      return;
    this.store.dispatch(new LoginStart(new AuthRequest(this.email.value, this.password.value)));
  }

  private _initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

}

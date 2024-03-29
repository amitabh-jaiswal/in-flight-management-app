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
import { LoadingState } from '../store/state/loading.state';
import { AuthLoader } from '../store/actions/loading.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  hide = true;
  matcher: ErrorStateMatchers;
  isLoading: boolean;
  private subscriptions$: Subscription[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.matcher = new ErrorStateMatchers();
    this._initLoginForm();
    this._stateSubscribe();
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(subs$ => subs$.unsubscribe());
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
    this.store.dispatch(new AuthLoader(true));
    this.store.dispatch(new LoginStart(new AuthRequest(this.email.value, this.password.value)));
  }

  private _initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  private _stateSubscribe() {
    this.subscriptions$.push(this.store.select('user').pipe(
      map((userData: UserState) => userData.isLoggedIn)
    ).subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn)
        this._initLoginForm();
    }));

    this.subscriptions$.push(this.store.select('loading').pipe(
      map((state: LoadingState) => state.auth)
    ).subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
      console.log(this.isLoading);
    })
    );
  }

}

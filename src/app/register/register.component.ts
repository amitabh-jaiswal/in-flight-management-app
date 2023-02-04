import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorStateMatchers, confirmPasswordValidator } from '../validators/error-state-matcher.validator';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { UserState } from '../store/state/user.state';
import { map } from 'rxjs/operators';
import { group } from '@angular/animations';
import { SignUpStart, SignupStartV2 } from '../store/actions/auth.actions';
import { AuthRequest } from '../models/auth-request';
import { AuthLoader } from '../store/actions/loading.action';
import { LoadingState } from '../store/state/loading.state';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  hide = true;
  confirmHide = true;
  matcher: ErrorStateMatchers;
  isLoading: boolean;
  private subscriptions$: Subscription[] = [];

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.matcher = new ErrorStateMatchers();
    this._initLoginForm();
    this._stateSubscribe();
  }

  ngOnDestroy() {
    this.subscriptions$.forEach(subs$ => subs$.unsubscribe());
  }

  get firstName() {
    return this.registerForm.controls.firstName;
  }

  get lastName() {
    return this.registerForm.controls.lastName;
  }

  get phone() {
    return this.registerForm.controls.phone;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid)
      return;
    this.store.dispatch(new AuthLoader(true));
    // this.store.dispatch(new SignUpStart(new AuthRequest(this.email.value, this.password.value)));
    this.store.dispatch(new SignupStartV2({
      email: this.email.value, firstName: this.firstName.value,
      lastName: this.lastName.value, password: this.password.value,
      phone: this.phone.value, roles: ['FLIGHT_STAFF']
    }));
  }

  onKeyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  private _initLoginForm() {
    this.registerForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword')
      });
  }

  private _stateSubscribe() {
    this.subscriptions$.push(
      this.store.select('user').pipe(
        map((userData: UserState) => userData.isLoggedIn)
      ).subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn)
          this._initLoginForm();
      })
    );

    this.subscriptions$.push(
      this.store.select('loading').pipe(
        map((loadingState: LoadingState) => loadingState.auth)
      ).subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      })
    );
  }

}

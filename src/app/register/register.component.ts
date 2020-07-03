import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorStateMatchers, confirmPasswordValidator } from '../validators/error-state-matcher.validator';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { UserState } from '../store/state/user.state';
import { map } from 'rxjs/operators';
import { group } from '@angular/animations';
import { SignUpStart } from '../store/actions/auth.actions';
import { AuthRequest } from '../models/auth-request';

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
  loggedSubscribe$: Subscription;

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder) { }

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
    this.store.dispatch(new SignUpStart(new AuthRequest(this.email.value, this.password.value)));
  }

  private _initLoginForm() {
    this.registerForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword')
      });
  }

}

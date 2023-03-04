import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { AuthLoader, ToggleLoader } from '../store/actions/loading.action';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { RecaptchaComponent } from 'ng-recaptcha';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AccountService } from '../service/account.service';
import { OtpType } from '../models/account.dto.model';
import { SnackbarService } from '../service/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  loginOption: string;
  isOtpSent: boolean;
  phoneForm: FormGroup;
  otpForm: FormGroup;
  currentStepLabel: string;
  private subscriptions$: Subscription[] = [];
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  @ViewChild(RecaptchaComponent) recaptcha!: RecaptchaComponent;

  constructor(private store: Store<AppState>, private _accountService: AccountService,
    private _snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.matcher = new ErrorStateMatchers();
    this.loginOption = 'password';
    this.isOtpSent = false;
    this._initLoginForm();
    this._initPhoneForm();
    this._initOtpForm();
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

  getControl(formGroup: FormGroup, name: string) {
    return formGroup.controls[name];
  }

  onSubmit() {
    if ((this.loginOption === 'password' && this.loginForm.invalid) ||
      (this.loginOption === 'phone' && this.phoneForm.invalid && this.otpForm.invalid)) {
      return;
    }
    this.store.dispatch(new AuthLoader(true));
    let payload;
    if (this.loginOption === 'password') {
      payload = new AuthRequest(this.email.value, this.password.value);
    } else {
      payload = {
        phone: this.getControl(this.phoneForm, 'phone').value,
        code: this.getControl(this.otpForm, 'code').value
      }
    }
    this.store.dispatch(new LoginStart(payload));
  }
  handleOptionChange() {
    if (this.loginOption === 'password') {
      // this.phoneForm = null;
      // this._initLoginForm();
      this.loginForm.reset();
    } else if (this.loginOption === 'phone') {
      // this.loginForm = null;
      // this._initPhoneForm();
      this.currentStepLabel = 'Phone Number';
      this.phoneForm.reset();
      this.otpForm.reset();
    }
  }

  sendOtp(captchaToken: string) {
    console.log('Captcha Token: ', captchaToken);
    if (this.currentStepLabel === 'Phone Number' && this.phoneForm.invalid) {
      return;
    }
    this.store.dispatch(new ToggleLoader({ isLoading: true }));
    this._accountService.sendOtp(OtpType.PHONE_LOGIN, captchaToken, this.getControl(this.phoneForm, 'phone').value).subscribe((response) => {
      this.isOtpSent = true;
      this.store.dispatch(new ToggleLoader({ isLoading: false }));
      if (this.currentStepLabel !== 'OTP') {
        this.stepper.next();
      }
      this._snackbarService.success(response.message);
    }, (err: Error | HttpErrorResponse) => {
      this.store.dispatch(new ToggleLoader({ isLoading: false }));
      const msg = err instanceof Error ? err.message : err.error.message;
      this._snackbarService.error(msg);
    });
  }

  handleStepChange(step: StepperSelectionEvent) {
    console.log(step.selectedStep.label);
    this.currentStepLabel = step.selectedStep.label;
  }

  private _initPhoneForm() {
    this.currentStepLabel = 'Phone Number';
    this.phoneForm = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)])
      // code: new FormControl('', [Validators.required])
    });
  }

  private _initOtpForm() {
    this.otpForm = new FormGroup({
      code: new FormControl('', [Validators.required])
    });
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

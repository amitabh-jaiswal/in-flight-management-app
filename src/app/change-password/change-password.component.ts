import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { RecaptchaLoaderService } from 'ng-recaptcha';
import { OtpType } from '../models/account.dto.model';
import { AccountService } from '../service/account.service';
import { SnackbarService } from '../service/snackbar.service';
import { confirmPasswordValidator } from '../validators/error-state-matcher.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  matcher: ErrorStateMatcher;
  changePasswordForm: FormGroup;
  newHide: boolean;
  confirmHide: boolean;
  isLoading: boolean;
  isOtpSent: boolean;
  showOtpButton: boolean;
  // showOtpTimer: any;
  timer: string;

  constructor(private _formBuilder: FormBuilder, private _message: SnackbarService,
    private _accountService: AccountService, private _router: Router, private _recaptchaLoaderService: RecaptchaLoaderService) { }

  ngOnInit(): void {
    this.showOtpButton = true;
    this.isOtpSent = false;
    this.isLoading = false;
    this.newHide = true;
    this.confirmHide = true;
    this.matcher = new ErrorStateMatcher();
    this._initForm();
    
  }

  // ngAfterViewInit() {
  //   firebase.auth(firebase.initializeApp(environment.firebaseConfig));
  //   window['recaptchaVerifier'] = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  //     size: 'normal',
  //     callback: (response) => this.sendOtpWithCaptcha(response)
  //   });
  //   window['recaptchaVerifier'].render();
  // }

  get newPassword() {
    return this.changePasswordForm.controls.newPassword;
  }

  get confirmPassword() {
    return this.changePasswordForm.controls.confirmPassword;
  }

  get code() {
    return this.changePasswordForm.controls.code;
  }

  get disabled() {
    return !!this.changePasswordForm.invalid;
  }

  get tooltip() {
    return `Wait for ${this.timer} seconds before re-sending otp`;
  }

  sendOtp(captchaToken: string, resend: boolean = false) {
    if (resend && !this.showOtpButton) {
      this._message.error('OTP is already sent. Please wait for the sometime before resending.');
      return;
    }
    this.isLoading = true;
    this._accountService.sendOtp(OtpType.UPDATE_PASSWORD, captchaToken).subscribe((response) => {
      this.isOtpSent = true;
      // this.showOtpTimer = setTimeout(() => {this.showOtpButton = true;}, 3000);
      this._showTimer(30);
      this._message.success(response.message);
      this.isLoading = false;
    }, (err: Error | HttpErrorResponse) => {
      const message = err instanceof HttpErrorResponse ? err.error.message : err.message;
      this._message.error(message);
      this.isLoading = false;
    });
  }

  sendOtpWithCaptcha(captchaToken: string) {
    if (captchaToken) {
      this.sendOtp(captchaToken, this.isOtpSent);
    }
  }

  handleSubmit() {
    if (this.changePasswordForm.invalid) {
      this._message.success('Form is invalid');
      return;
    }
    this.isLoading = true;
    this._accountService.updatePassword(this.newPassword.value, this.code.value).subscribe((response) => {
      this.isLoading = false;
      if (response.message) {
        this._message.success(response.message);
        this._router.navigate(['/flight']);
      }
    }, (err: Error | HttpErrorResponse) => {
      const message = err instanceof HttpErrorResponse ? err.error.message : err.message;
      this._message.error(message);
      this.isLoading = false;
    });
  }

  private _initForm() {
    this.changePasswordForm = this._formBuilder.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)],),
      code: new FormControl('', Validators.required)
    }, {
      validators: confirmPasswordValidator('newPassword', 'confirmPassword')
    });
  }

  private _showTimer(seconds) {
    let textSec: any = "0";
    let statSec: number = seconds;
    // this.showOtpButton = false;
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.timer = `${textSec}`;
      this.showOtpButton = false;

      if (seconds == 0) {
        this.showOtpButton = true;
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }
}

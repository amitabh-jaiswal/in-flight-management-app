import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EmailMode } from '../models/email-mode.enum';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  mode: string;
  code: string;
  newPasswordControl: FormControl;
  emailControl: FormControl;
  showSendEmail: boolean;
  continueUrl: string;
  isLoading: boolean;
  showError: boolean;

  constructor(private _route: ActivatedRoute, private _authService: AuthService,
    private _snackbar: MatSnackBar, private _router: Router) { }

  ngOnInit(): void {
    this.showSendEmail = false;
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.newPasswordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this._getQueryParams();
  }

  get email() {
    return this.emailControl.value
  }

  get newPassword() {
    return this.newPasswordControl.value;
  }

  get title() {
    return this.showError ? 'Try resetting your password again' : 'Reset your password';
  }

  get buttonLabel() {
    return this.mode && this.code ? 'Save' : 'Send';
  }

  get disable() {
    if (this.mode && this.code) {
      if (this.newPassword && !this.newPasswordControl.errors) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.email && !this.emailControl.errors) {
        return false;
      } else {
        return true;
      }
    }
  }

  handleAction() {
    this.isLoading = true;
    if (this.mode && this.code && this.newPassword) {
      this._confirmResetPassword(true);
    } else if (!this.mode && !this.code && this.email) {
      this._sendEmail(true);
    } else {
      this.isLoading = false;
    }
  }

  private _getQueryParams() {
    this._route.queryParamMap.subscribe((params: ParamMap) => {
      if (params.has('mode') && params.has('oobCode')) {
        this.isLoading = true;
        this.mode = params.get('mode');
        this.code = params.get('oobCode');
        this.continueUrl = params.get('continueUrl');
        this._confirmResetPassword();
      }
    });
  }

  private _confirmResetPassword(naviagte: boolean = false) {
    this._authService.confirmResetPassword(this.code, this.newPassword ? this.newPassword : undefined).subscribe((response) => {
      if (response.message) {
        this._snackbar.open(response.message, undefined, {
          panelClass: 'success-snackbar'
        });
      }
      this.isLoading = false
      if (naviagte) {
        this._router.navigate([this.continueUrl]);
      }
    }, (error: Error | HttpErrorResponse) => {
      const message: string = error instanceof Error ? error.message : error.error.message;
      if (message.includes('Invalid Code')) {
        this.showError = true;
      } else {
        this._snackbar.open(message, undefined, { panelClass: 'error-snackbar' });
      }
      this.isLoading = false
    });
  }

  private _sendEmail(reset: boolean = false) {
    this._authService.sendEmail(EmailMode.RESET_PASSWORD, this.email, true).subscribe((response) => {
      if (response.message) {
        this._snackbar.open(response.message, undefined, {
          panelClass: 'success-snackbar'
        });
      }
      this.isLoading = false;
      if (reset) {
        this.showSendEmail = true;
        this.emailControl.reset();
      }
    }, (error: Error | HttpErrorResponse) => {
      const message: string = error instanceof Error ? error.message : error.error.message;
      this._snackbar.open(message, undefined, { panelClass: 'error-snackbar' });
      this.isLoading = false
    })
  }
}

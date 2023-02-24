import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackbar: MatSnackBar) { }

  success(message: string) {
    this._snackbar.open(message, null, { panelClass: 'success-snackbar' });
  }

  error(message: string) {
    this._snackbar.open(message, null, { panelClass: 'error-snackbar' });
  }
}

import { ErrorStateMatcher } from '@angular/material/core';
import { NgForm, FormControl, FormGroupDirective, FormGroup } from '@angular/forms';

export class ErrorStateMatchers implements ErrorStateMatcher {

  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    // const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}

export function confirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.confirmPassword)
      return;

    if (control.value !== matchingControl.value)
      matchingControl.setErrors({ confirmPassword: true });
    else
      matchingControl.setErrors(null);
  };
}

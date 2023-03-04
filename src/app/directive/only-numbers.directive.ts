import { Directive, HostListener, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]',
})
export class OnlyNumbersDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode != 8 && !pattern.test(inputChar)) {
      e.preventDefault();
    }
  }
}

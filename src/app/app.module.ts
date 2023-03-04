import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/reducers/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffect } from './store/effects/auth.effect';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from './material/material.module';
import { FlighEffect } from './store/effects/flight.effect';
import { ErrorEffect } from './store/effects/error.effect';
import { SeatMapEffect } from './store/effects/seat-map.effect';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailActionsComponent } from './email-actions/email-actions.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CookieService } from 'ngx-cookie-service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserEffect } from './store/effects/user.effect';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { OnlyNumbersDirective } from './directive/only-numbers.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    EmailActionsComponent,
    ChangePasswordComponent,
    OnlyNumbersDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducer),
    RecaptchaFormsModule,
    RecaptchaModule,
    EffectsModule.forRoot([AuthEffect, FlighEffect, ErrorEffect, SeatMapEffect, UserEffect]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: environment.captchaSiteKey } as RecaptchaSettings },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailActionsComponent } from './email-actions/email-actions.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginComponent
  },
  {
    path: 'signup',
    canActivate: [LoginGuard],
    component: RegisterComponent
  },
  {
    path: 'auth/action',
    canActivate: [LoginGuard],
    component: EmailActionsComponent
  },
  {
    path: 'reset-password',
    canActivate: [LoginGuard],
    component: ResetPasswordComponent
  },
  {
    path: 'flight',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/check-in/check-in.module').then(m => m.CheckInModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

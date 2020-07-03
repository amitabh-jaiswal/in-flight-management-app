import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckInComponent } from './check-in/check-in.component';
import { PassengerListComponent } from './passenger-list/passenger-list.component';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { PassengerResolverService } from './resolver/passenger-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: CheckInComponent
  },
  // {
  //   path: 'passengers',
  //   component: PassengerListComponent
  // },
  // {
  //   path: 'passengers-details/:passengerId',
  //   component: PassengerDetailsComponent
  // }
  {
    path: 'passengers',
    children: [
      {
        path: '',
        component: PassengerListComponent,
      },
      {
        path: ':passengerId',
        component: PassengerDetailsComponent,
        resolve: {
          passengerDetails: PassengerResolverService
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckInRoutingModule { }

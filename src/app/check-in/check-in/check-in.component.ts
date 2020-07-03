import { Component, OnInit, OnDestroy } from '@angular/core';
import { Flight } from 'src/app/models/flight.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { Subscription, Observable } from 'rxjs';
import { FlightState } from 'src/app/store/state/flight.state';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserState } from 'src/app/store/state/user.state';
import { User } from 'src/app/models/user.model';
import { ServiceDetail } from 'src/app/models/service-detail.model';
import { ServiceType } from 'src/app/constant/service-type.enum';
import { AddService } from 'src/app/models/add-service.model';
import { MatDialog } from '@angular/material/dialog';
import { AddServiceDialogComponent } from '../add-service-dialog/add-service-dialog.component';
import { AncillaryService } from 'src/app/service/ancillary.service';
import { UpdateFlightDetails } from 'src/app/store/actions/flight.action';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit, OnDestroy {

  flightInfo: Flight;
  flightSubs: Subscription;
  userSubs$: Subscription;
  isUserAdmin: boolean;
  meals: ServiceDetail[];
  beverages: ServiceDetail[];
  shoppingItems: ServiceDetail[];
  isServiceUpdating: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private ancillaryService: AncillaryService
  ) { }

  ngOnInit(): void {
    this.isServiceUpdating = false;
    this.meals = new Array();
    this.beverages = new Array();
    this.shoppingItems = new Array();
    this.flightSubs = this.store.select('selectedFlight').pipe(
      map((state: FlightState) => state.flightDetails)
    ).subscribe((response: Flight) => {
      if (response) {
        this.flightInfo = JSON.parse(JSON.stringify(response));
        this._fetchAncillaryServices();
      }
      else {
        this.flightInfo = null;
        this.meals = [];
        this.beverages = [];
        this.shoppingItems = [];
      }
    });
    this.userSubs$ = this.store.select('user').pipe(
      map((state: UserState) => state.user)
    ).subscribe((user: User) => {
      if (user)
        this.isUserAdmin = user.isAdmin;
      else
        this.isUserAdmin = false;
    });
  }

  ngOnDestroy() {
    if (this.flightSubs)
      this.flightSubs.unsubscribe();
    if (this.userSubs$)
      this.userSubs$.unsubscribe();
  }

  noServiceMessage(serviceType: string) {
    return 'No ' + serviceType + ' are selected for the flight.';
  }

  onSelect(ServiceInfo: ServiceDetail, serviceType: string) {
    ServiceInfo.isSelected = !ServiceInfo.isSelected;
    this._serviceAction(ServiceInfo.id, serviceType, !ServiceInfo.isSelected);
  }

  addService() {
    const dialogData = new AddService(this.isUserAdmin, this.flightInfo.ancillaryServices.meals,
      this.flightInfo.ancillaryServices.beverages, this.flightInfo.ancillaryServices.shoppingItems);
    const dialogRef = this.dialog.open(AddServiceDialogComponent, {
      data: {
        service: dialogData,
        forPassenger: false,
        newPassengerServices: true
      }
    });
    dialogRef.afterClosed().subscribe((result: { action: string, result: AddService }) => {
      if (result && result.action === 'save') {
        // if (result.result.meals.length > 0)
        this.flightInfo.ancillaryServices.meals = result.result.meals;
        // if (result.result.beverages.length > 0)
        this.flightInfo.ancillaryServices.beverages = result.result.beverages;
        // if (result.result.shoppingItems.length > 0)
        this.flightInfo.ancillaryServices.shoppingItems = result.result.shoppingItems;
        this._updateFlightInfo();
      }
    });
  }

  private _serviceAction(serviceId: number, serviceType: string, isAdd: boolean) {
    if (serviceType === ServiceType.MEALS) {
      const index = this.flightInfo.ancillaryServices.meals.findIndex(id => id === serviceId);
      if (index !== -1)
        this.flightInfo.ancillaryServices.meals.splice(index, 1);
      else if (index === -1 && isAdd)
        this.flightInfo.ancillaryServices.meals.push(serviceId);
    }
    else if (serviceType === ServiceType.BEVERAGES) {
      const index = this.flightInfo.ancillaryServices.beverages.findIndex(id => id === serviceId);
      if (index !== -1)
        this.flightInfo.ancillaryServices.beverages.splice(index, 1);
      else if (index === -1 && isAdd)
        this.flightInfo.ancillaryServices.beverages.push(serviceId);
    }
    else if (serviceType === ServiceType.SHOPPING_ITEMS) {
      const index = this.flightInfo.ancillaryServices.shoppingItems.findIndex(id => id === serviceId);
      if (index !== -1)
        this.flightInfo.ancillaryServices.shoppingItems.splice(index, 1);
      else if (index === -1 && isAdd)
        this.flightInfo.ancillaryServices.shoppingItems.push(serviceId);
    }
  }

  private _updateFlightInfo() {
    this.store.dispatch(new UpdateFlightDetails(this.flightInfo));
  }

  private _fetchAncillaryServices() {
    if (this.flightInfo.ancillaryServices) {
      if (this.flightInfo.ancillaryServices.meals.length > 0)
        this._fetchAncillaryServicesData(ServiceType.MEALS);
      else
        this.meals = [];
      if (this.flightInfo.ancillaryServices.shoppingItems.length > 0)
        this._fetchAncillaryServicesData(ServiceType.SHOPPING_ITEMS);
      else
        this.shoppingItems = [];
      if (this.flightInfo.ancillaryServices.beverages.length > 0)
        this._fetchAncillaryServicesData(ServiceType.BEVERAGES);
      else
        this.beverages = [];
    }
  }

  private _fetchAncillaryServicesData(serviceType: string) {
    if (serviceType === ServiceType.MEALS)
      this.ancillaryService.getMeals(this.flightInfo.ancillaryServices.meals).subscribe(
        (meals: ServiceDetail[]) => {
          if (meals)
            this.meals = meals;
        });
    else if (serviceType === ServiceType.BEVERAGES)
      this.ancillaryService.getBeverages(this.flightInfo.ancillaryServices.beverages).subscribe(
        (beverages: ServiceDetail[]) => {
          if (beverages)
            this.beverages = beverages;
        });
    else if (serviceType === ServiceType.SHOPPING_ITEMS)
      this.ancillaryService.getShoppingItems(this.flightInfo.ancillaryServices.shoppingItems).subscribe(
        (items: ServiceDetail[]) => {
          if (items)
            this.shoppingItems = items;
        });
  }

  updateDetails(isServiceUpdating?: boolean) {
    if (isServiceUpdating)
      this.isServiceUpdating = !this.isServiceUpdating;
  }

}

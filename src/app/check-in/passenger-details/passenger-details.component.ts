import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Passenger } from 'src/app/models/passenger.model';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PassengerService } from 'src/app/service/passenger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceDetail } from 'src/app/models/service-detail.model';
import { AncillaryService } from 'src/app/service/ancillary.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { UserState } from 'src/app/store/state/user.state';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ServiceType } from 'src/app/constant/service-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { AddServiceDialogComponent } from '../add-service-dialog/add-service-dialog.component';
import { AddService } from 'src/app/models/add-service.model';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit, OnDestroy {

  passenger: Passenger;
  errorMessage: string;
  noDataMessage = 'No Data';
  isUserAdmin: boolean;
  isUpdating: boolean;
  passport: string;
  dob: Date;
  address: string;
  meals: ServiceDetail[];
  beverages: ServiceDetail[];
  shoppingItems: ServiceDetail[];
  userSubs$: Subscription;
  seatMapSub$: Subscription;
  isServiceUpdating: boolean;
  mealsSelected: number[];
  beveragesSelected: number[];
  shoppingItemsSelected: number[];

  constructor(
    private route: ActivatedRoute,
    private passengerService: PassengerService,
    private snackbar: MatSnackBar,
    private ancillaryService: AncillaryService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._initializeValues();
    this._getResolvedData();
    this._isUserAdmin();
  }

  ngOnDestroy() {
    if (this.userSubs$)
      this.userSubs$.unsubscribe();
  }

  updateDetails(isServiceUpdating?: boolean) {
    if (isServiceUpdating) {
      this.isServiceUpdating = !this.isServiceUpdating;
      if (!this.isServiceUpdating)
        this._changeSelectedFlagForServices();
    } else
      this.isUpdating = !this.isUpdating;
  }

  setValues(isUpdateCanceled: boolean) {
    if (isUpdateCanceled) {
      this.address = null;
      this.dob = null;
      this.passport = null;
    } else {
      this.address = this.passenger.address;
      this.dob = this.passenger.dob;
      this.passport = this.passenger.passportNumber;
    }
  }

  changeCheckInStatus(isUndoCalled: boolean) {
    if (isUndoCalled)
      this.passenger.checkedIn = false;
    else
      this.passenger.checkedIn = true;
    this._updatePassengerDetails();
  }

  saveDetails(isServiceUpdate?: boolean) {
    if (!isServiceUpdate) {
      this.passenger.dob = this.dob ? this.dob : this.passenger.dob;
      this.passenger.passportNumber = this.passport ? this.passport : this.passenger.passportNumber;
      this.passenger.address = this.address ? this.address : this.passenger.address;
    }
    this._updatePassengerDetails(true, isServiceUpdate);
  }

  noServiceMessage(serviceType: string) {
    return 'No ' + serviceType + ' are selected by the passenger.';
  }

  addService() {
    const dialogData = new AddService(this.isUserAdmin, this.passenger.ancillaryServices.meals,
      this.passenger.ancillaryServices.beverages, this.passenger.ancillaryServices.shoppingItems);
    const dialogRef = this.dialog.open(AddServiceDialogComponent, {
      data: {
        service: dialogData,
        forPassenger: true
      }
    });
    dialogRef.afterClosed().subscribe((result: { action: string, result: AddService }) => {
      if (result && result.action === 'save') {
        // if (result.result.meals.length > 0)
        this.passenger.ancillaryServices.meals = result.result.meals;
        // if (result.result.beverages.length > 0)
        this.passenger.ancillaryServices.beverages = result.result.beverages;
        // if (result.result.shoppingItems.length > 0)
        this.passenger.ancillaryServices.shoppingItems = result.result.shoppingItems;
        this._updatePassengerDetails(false, true);
      }
    });
  }

  onSelect(serviceDetail: ServiceDetail, serviceType: string) {
    serviceDetail.isSelected = !serviceDetail.isSelected;
    this._serviceAction(serviceDetail.id, serviceType, !serviceDetail.isSelected);
  }

  private _getResolvedData() {
    this.route.data.subscribe((response: Data) => {
      if (response.passengerDetails || response.passengerDetails !== null) {
        this.passenger = response.passengerDetails as Passenger;
        this.errorMessage = undefined;
        this._fetchAncillaryServices();
      }
      else {
        this.errorMessage = 'Passenger Details Does not Exists!!';
        this.passenger = null;
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  private _updatePassengerDetails(isSaveButtonClicked?: boolean, isServiceUpdate?: boolean) {
    this.passengerService.updatePassengerInfo(this.passenger).subscribe((respone: Passenger) => {
      if (respone) {
        this.passenger = respone;
        this._showMessage('Details Updated Successfully!', 'success-snackbar');
        if (isSaveButtonClicked) {
          this.isUpdating = false;
          this.isServiceUpdating = false;
        }
        if (isServiceUpdate)
          this._fetchAncillaryServices();
      } else
        this._showMessage('Some Error Occured!!', 'error-snackbar');
    });
  }

  private _initializeValues() {
    this.isUserAdmin = false;
    this.isUpdating = false;
    this.isServiceUpdating = false;
    this.meals = new Array();
    this.shoppingItems = new Array();
    this.beverages = new Array();
    this.mealsSelected = new Array();
    this.shoppingItemsSelected = new Array();
    this.beveragesSelected = new Array();
  }

  private _showMessage(message: string, className: string) {
    this.snackbar.open(message, '', {
      panelClass: className
    });
  }

  private _fetchAncillaryServicesData(serviceType: string) {
    if (serviceType === ServiceType.MEALS)
      this.ancillaryService.getMeals(this.passenger.ancillaryServices.meals).subscribe(
        (meals: ServiceDetail[]) => {
          if (meals)
            this.meals = meals;
        });
    else if (serviceType === ServiceType.BEVERAGES)
      this.ancillaryService.getBeverages(this.passenger.ancillaryServices.beverages).subscribe(
        (beverages: ServiceDetail[]) => {
          if (beverages)
            this.beverages = beverages;
        });
    else if (serviceType === ServiceType.SHOPPING_ITEMS)
      this.ancillaryService.getShoppingItems(this.passenger.ancillaryServices.shoppingItems).subscribe(
        (items: ServiceDetail[]) => {
          if (items)
            this.shoppingItems = items;
        });
  }

  private _isUserAdmin() {
    this.userSubs$ = this.store.select('user').pipe(
      map((userState: UserState) => userState.user)
    ).subscribe((user: User) => {
      if (user)
        this.isUserAdmin = user.isAdmin;
      else
        this.isUserAdmin = false;
    });
  }

  private _changeSelectedFlagForServices() {
    this.meals.forEach((service) => {
      const index = this.passenger.ancillaryServices.meals.findIndex(id => id === service.id);
      if (index === -1)
        this.passenger.ancillaryServices.meals.push(service.id);
      service.isSelected = false;
    });
    this.beverages.forEach((service) => {
      const index = this.passenger.ancillaryServices.beverages.findIndex(id => id === service.id);
      if (index === -1)
        this.passenger.ancillaryServices.beverages.push(service.id);
      service.isSelected = false;
    });
    this.shoppingItems.forEach((service) => {
      const index = this.passenger.ancillaryServices.shoppingItems.findIndex(id => id === service.id);
      if (index === -1)
        this.passenger.ancillaryServices.shoppingItems.push(service.id);
      service.isSelected = false;
    });
  }

  private _serviceAction(serviceId: number, serviceType: string, isAdd: boolean) {

    if (serviceType === ServiceType.MEALS) {
      const index = this.passenger.ancillaryServices.meals.findIndex(id => id === serviceId);
      if (index !== -1)
        this.passenger.ancillaryServices.meals.splice(index, 1);
      else if (index === -1 && isAdd)
        this.passenger.ancillaryServices.meals.push(serviceId);
    }
    else if (serviceType === ServiceType.BEVERAGES) {
      const index = this.passenger.ancillaryServices.beverages.findIndex(id => id === serviceId);
      if (index !== -1)
        this.passenger.ancillaryServices.beverages.splice(index, 1);
      else if (index === -1 && isAdd)
        this.passenger.ancillaryServices.beverages.push(serviceId);
    }
    else if (serviceType === ServiceType.SHOPPING_ITEMS) {
      const index = this.passenger.ancillaryServices.shoppingItems.findIndex(id => id === serviceId);
      if (index !== -1)
        this.passenger.ancillaryServices.shoppingItems.splice(index, 1);
      else if (index === -1 && isAdd)
        this.passenger.ancillaryServices.shoppingItems.push(serviceId);
    }
    // }
  }

  private _fetchAncillaryServices() {
    if (this.passenger.ancillaryServices) {
      if (this.passenger.ancillaryServices.meals.length > 0)
        this._fetchAncillaryServicesData(ServiceType.MEALS);
      else
        this.meals = [];

      if (this.passenger.ancillaryServices.shoppingItems.length > 0)
        this._fetchAncillaryServicesData(ServiceType.SHOPPING_ITEMS);
      else
        this.shoppingItems = [];

      if (this.passenger.ancillaryServices.beverages.length > 0)
        this._fetchAncillaryServicesData(ServiceType.BEVERAGES);
      else
        this.beverages = [];
    }
  }

}

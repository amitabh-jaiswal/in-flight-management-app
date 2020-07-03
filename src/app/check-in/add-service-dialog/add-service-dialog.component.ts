import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddService } from 'src/app/models/add-service.model';
import { AncillaryService } from 'src/app/service/ancillary.service';
import { ServiceDetail } from 'src/app/models/service-detail.model';
import { ServiceType } from 'src/app/constant/service-type.enum';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { FlightState } from 'src/app/store/state/flight.state';
import { Flight } from 'src/app/models/flight.model';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-service-dialog',
  templateUrl: './add-service-dialog.component.html',
  styleUrls: ['./add-service-dialog.component.scss']
})
export class AddServiceDialogComponent implements OnInit, OnDestroy {

  meals: ServiceDetail[];
  beverages: ServiceDetail[];
  shoppingItems: ServiceDetail[];
  mealsSelected: number[];
  beveragesSelected: number[];
  shoppingItemSelected: number[];
  flightSubs$: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AddServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: AddService, forPassenger: boolean, newPassengerServices: boolean },
    private store: Store<AppState>,
    private ancillaryService: AncillaryService
  ) { }

  ngOnInit(): void {
    this._initialize();
    if (!this.data.forPassenger)
      this._fetchServciesForFlight();
    else
      this.flightSubs$ = this.store.select('selectedFlight').pipe(
        map((state: FlightState) => state.flightDetails)
      ).subscribe((response: Flight) => {
        if (response && response.ancillaryServices) {
          const servcies = response.ancillaryServices;
          this._fetchServicesForPassenger(servcies.meals, servcies.beverages, servcies.shoppingItems);
        }
      });
  }

  ngOnDestroy() {
    if (this.flightSubs$)
      this.flightSubs$.unsubscribe();
  }

  onSelect(serviceDetail: ServiceDetail, serviceType: string) {
    serviceDetail.isSelected = !serviceDetail.isSelected;
    this._updateSelectedService(serviceDetail.id, serviceType, serviceDetail.isSelected);
  }

  onSave() {
    const result = new AddService(this.data.service.isAdmin, this.mealsSelected, this.beveragesSelected, this.shoppingItemSelected);
    this.dialogRef.close({ result, action: 'save' });
  }

  private _fetchServciesForFlight() {
    this.ancillaryService.getAllMeals().subscribe((response: ServiceDetail[]) => {
      if (response)
        this.meals = response;
      this._setPreSelected(ServiceType.MEALS);
    });
    this.ancillaryService.getAllBeverages().subscribe((response: ServiceDetail[]) => {
      if (response)
        this.beverages = response;
      this._setPreSelected(ServiceType.BEVERAGES);
    });
    this.ancillaryService.getAllShoppingItems().subscribe((response: ServiceDetail[]) => {
      if (response)
        this.shoppingItems = response;
      this._setPreSelected(ServiceType.SHOPPING_ITEMS);
    });
  }

  private _fetchServicesForPassenger(meals: number[], beverages: number[], items: number[]) {
    if (meals.length > 0)
      this.ancillaryService.getMeals(meals).subscribe((response: ServiceDetail[]) => {
        if (response)
          this.meals = response;
        this._setPreSelected(ServiceType.MEALS);
      });
    if (beverages.length > 0)
      this.ancillaryService.getBeverages(beverages).subscribe((response: ServiceDetail[]) => {
        if (response)
          this.beverages = response;
        this._setPreSelected(ServiceType.BEVERAGES);
      });
    if (items.length > 0)
      this.ancillaryService.getShoppingItems(items).subscribe((response: ServiceDetail[]) => {
        if (response)
          this.shoppingItems = response;
        this._setPreSelected(ServiceType.SHOPPING_ITEMS);
      });
  }

  private _setPreSelected(serviceType: string) {
    if (serviceType === ServiceType.MEALS)
      this.meals.forEach((service: ServiceDetail) => {
        if (this.data.service.meals.includes(service.id)) {
          service.isSelected = true;
          this.mealsSelected.push(service.id);
        }
      });
    else if (serviceType === ServiceType.BEVERAGES)
      this.beverages.forEach((service: ServiceDetail) => {
        if (this.data.service.beverages.includes(service.id)) {
          service.isSelected = true;
          this.beveragesSelected.push(service.id);
        }
      });
    else if (serviceType === ServiceType.SHOPPING_ITEMS)
      this.shoppingItems.forEach((service: ServiceDetail) => {
        if (this.data.service.shoppingItems.includes(service.id)) {
          service.isSelected = true;
          this.shoppingItemSelected.push(service.id);
        }
      });
  }

  private _updateSelectedService(serviceId: number, serviceType: string, isAdd: boolean) {
    if (isAdd) {
      if (serviceType === ServiceType.MEALS)
        this.mealsSelected.push(serviceId);
      if (serviceType === ServiceType.BEVERAGES)
        this.beveragesSelected.push(serviceId);
      if (serviceType === ServiceType.SHOPPING_ITEMS)
        this.shoppingItemSelected.push(serviceId);
    }
    else
      if (serviceType === ServiceType.MEALS) {
        const index = this.mealsSelected.findIndex(id => id === serviceId);
        if (index !== -1)
          this.mealsSelected.splice(index, 1);
      }
      else if (serviceType === ServiceType.BEVERAGES) {
        const index = this.beveragesSelected.findIndex(id => id === serviceId);
        if (index !== -1)
          this.beveragesSelected.splice(index, 1);
      }
      else if (serviceType === ServiceType.SHOPPING_ITEMS) {
        const index = this.shoppingItemSelected.findIndex(id => id === serviceId);
        if (index !== -1)
          this.shoppingItemSelected.splice(index, 1);
      }
  }

  private _initialize() {
    this.meals = new Array();
    this.beverages = new Array();
    this.shoppingItems = new Array();
    this.mealsSelected = new Array();
    this.beveragesSelected = new Array();
    this.shoppingItemSelected = new Array();
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerDetailsComponent } from './passenger-details.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PassengerService } from 'src/app/service/passenger.service';
import { AncillaryService } from 'src/app/service/ancillary.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TestUtility } from 'src/app/utilities/test.utility';
import { MaterialModule } from 'src/app/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Passenger } from 'src/app/models/passenger.model';
import { ServiceType } from 'src/app/constant/service-type.enum';

describe('PassengerDetailsComponent', () => {
  let component: PassengerDetailsComponent;
  let fixture: ComponentFixture<PassengerDetailsComponent>;
  let mockStore: MockStore;
  let mockDialog: MatDialog;
  let mockPassengerService: jasmine.SpyObj<PassengerService>;
  let mockAncillarySevice: jasmine.SpyObj<AncillaryService>;
  let mockRoute: ActivatedRoute;
  let mockSnackBar: MatSnackBar;

  beforeEach(async(() => {
    const spyPassengerService = jasmine.createSpyObj('PassengerService', ['updatePassengerInfo']);
    const spyAncillaryService = jasmine.createSpyObj('AncillaryService', ['getMeals', 'getBeverages', 'getShoppingItems']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        NoopAnimationsModule,
        FormsModule
      ],
      declarations: [PassengerDetailsComponent],
      providers: [
        provideMockStore(),
        { provide: AncillaryService, useValue: spyAncillaryService },
        { provide: PassengerService, useValue: spyPassengerService },
        { provide: ActivatedRoute, useValue: { data: of({ passengerDetails: TestUtility.setUpPassengerData() }) } }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerDetailsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData() });
    mockAncillarySevice = TestBed.inject(AncillaryService) as jasmine.SpyObj<AncillaryService>;
    mockPassengerService = TestBed.inject(PassengerService) as jasmine.SpyObj<PassengerService>;
    mockRoute = TestBed.inject(ActivatedRoute);
    mockDialog = TestBed.inject(MatDialog);
    mockSnackBar = TestBed.inject(MatSnackBar);
    mockAncillarySevice.getMeals.and.
      returnValue(of([TestUtility.setUpServiceData(), TestUtility.setUpServiceData(true)]));
    mockAncillarySevice.getBeverages.and.
      returnValue(of([TestUtility.setUpServiceData(), TestUtility.setUpServiceData(true)]));
    mockAncillarySevice.getShoppingItems.and.
      returnValue(of([TestUtility.setUpServiceData(), TestUtility.setUpServiceData(true)]));
    mockPassengerService.updatePassengerInfo.and.callFake(
      (passenger: Passenger, isSeatChanged?: boolean, oldSeatNumber?: string) => {
        return of(TestUtility.setUpPassengerData(null, passenger.checkedIn,
          passenger.dob, passenger.passportNumber, passenger.address));
      });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update service details for the passenger', () => {
    component.isServiceUpdating = true;
    fixture.detectChanges();
    component.updateDetails(true);
    expect(component.passenger.ancillaryServices.meals.length > 0).toBeTruthy();
  });

  it('should allow to update the details of the passenger', () => {
    component.updateDetails();
    expect(component.isUpdating).toBeTruthy();
  });

  it('should check-in the passenger', () => {
    component.changeCheckInStatus(false);
    expect(component.passenger.checkedIn).toBeTruthy();
  });

  it('should undo the checked-in passenger', () => {
    component.changeCheckInStatus(true);
    expect(component.passenger.checkedIn).toBeFalsy();
  });

  it('should reset the update passenger details when update is cancelled', () => {
    component.dob = new Date();
    component.address = 'ABCD XYZ';
    component.passport = 'PASSPORT';
    fixture.detectChanges();
    component.setValues(true);
    expect(component.dob).toBeNull();
    expect(component.address).toBeNull();
    expect(component.passport).toBeNull();
  });

  it('should the update passenger details when updating', () => {
    component.setValues(false);
    expect(component.dob).toEqual(component.passenger.dob);
    expect(component.address).toEqual(component.passenger.address);
    expect(component.passport).toEqual(component.passenger.passportNumber);
  });

  it('should update the passenger in-flight services', () => {
    component.saveDetails(true);
    expect(mockAncillarySevice.getMeals).toHaveBeenCalled();
    expect(mockAncillarySevice.getBeverages).toHaveBeenCalled();
    expect(mockAncillarySevice.getShoppingItems).toHaveBeenCalled();
  });

  it('should update the passenger in-flight services', () => {
    const dob = new Date();
    component.dob = dob;
    component.address = 'ABCD XYZ';
    component.passport = 'PASSPORT';
    fixture.detectChanges();
    component.saveDetails(false);
    expect(component.passenger.dob).toBe(dob);
    expect(component.passenger.address).toBe('ABCD XYZ');
    expect(component.passenger.passportNumber).toBe('PASSPORT');
  });

  it('should remove the in-flight services of the passenger', () => {
    const service = TestUtility.setUpServiceData();
    component.onSelect(service, ServiceType.MEALS);
    component.onSelect(service, ServiceType.BEVERAGES);
    component.onSelect(service, ServiceType.SHOPPING_ITEMS);
    expect(!component.passenger.ancillaryServices.meals.includes(service.id)).toBeTruthy();
    expect(!component.passenger.ancillaryServices.beverages.includes(service.id)).toBeTruthy();
    expect(!component.passenger.ancillaryServices.shoppingItems.includes(service.id)).toBeTruthy();
  });

  it('should add in flight services of the passenger', () => {
    const service = TestUtility.setUpServiceData(true);
    service.isSelected = true;
    component.onSelect(service, ServiceType.MEALS);
    component.onSelect(service, ServiceType.BEVERAGES);
    component.onSelect(service, ServiceType.SHOPPING_ITEMS);
    expect(component.passenger.ancillaryServices.meals.includes(service.id)).toBeTrue();
    expect(component.passenger.ancillaryServices.shoppingItems.includes(service.id)).toBeTrue();
  });

});

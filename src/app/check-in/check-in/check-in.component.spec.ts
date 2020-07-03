import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInComponent } from './check-in.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AncillaryService } from 'src/app/service/ancillary.service';
import { UserState } from 'src/app/store/state/user.state';
import { MemoizedSelectorWithProps, MemoizedSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { Props } from '@ngrx/store/src/models';
import { FlightState } from 'src/app/store/state/flight.state';
import { TestUtility } from 'src/app/utilities/test.utility';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServiceType } from 'src/app/constant/service-type.enum';
import { AddService } from 'src/app/models/add-service.model';
import { By } from '@angular/platform-browser';
import { AddServiceDialogComponent } from '../add-service-dialog/add-service-dialog.component';

describe('CheckInComponent', () => {
  let component: CheckInComponent;
  let fixture: ComponentFixture<CheckInComponent>;
  let mockStore: MockStore;
  let mockDialog: MatDialog;
  let mockAncillaryService: AncillaryService;
  let mockUserSelect: MemoizedSelectorWithProps<AppState, Props<UserState>, UserState>;
  let mockFlightSelect: MemoizedSelector<AppState, FlightState>;
  let getBeverages: any;
  let getMeals: any;
  let getItems: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        FormsModule
      ],
      declarations: [CheckInComponent],
      providers: [
        provideMockStore(),
        {
          provide: MatDialogRef,
          useValue: {
            close: (result?: { action: string }) => { console.log(result.action + ' called'); },
            afterClosed: (() => {
              console.log('After Closed');
              return of({ action: 'Save', result: new AddService(false, [23], [43], [53]) });
            })
          }
        }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockUserSelect = mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData() });
    mockFlightSelect = mockStore.overrideSelector('selectedFlight',
      { flightDetails: TestUtility.setupFlightData() }) as MemoizedSelector<AppState, FlightState>;
    mockAncillaryService = TestBed.inject(AncillaryService);
    mockDialog = TestBed.inject(MatDialog);
    getBeverages = spyOn(mockAncillaryService, 'getBeverages').and
      .returnValue(of([TestUtility.setUpServiceData(), TestUtility.setUpServiceData()]));
    getMeals = spyOn(mockAncillaryService, 'getMeals').and
      .returnValue(of([TestUtility.setUpServiceData(), TestUtility.setUpServiceData()]));
    getItems = spyOn(mockAncillaryService, 'getShoppingItems').and
      .returnValue(of([TestUtility.setUpServiceData(), TestUtility.setUpServiceData()]));
    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove services in flight details', () => {
    const service = TestUtility.setUpServiceData();
    component.onSelect(service, ServiceType.MEALS);
    component.onSelect(service, ServiceType.BEVERAGES);
    component.onSelect(service, ServiceType.SHOPPING_ITEMS);
    expect(!component.flightInfo.ancillaryServices.meals.includes(service.id)).toBeTruthy();
    expect(!component.flightInfo.ancillaryServices.beverages.includes(service.id)).toBeTruthy();
    expect(!component.flightInfo.ancillaryServices.shoppingItems.includes(service.id)).toBeTruthy();
  });

  it('should add services in flight details', () => {
    const service = TestUtility.setUpServiceData(true);
    service.isSelected = true;
    component.onSelect(service, ServiceType.MEALS);
    component.onSelect(service, ServiceType.BEVERAGES);
    component.onSelect(service, ServiceType.SHOPPING_ITEMS);
    expect(component.flightInfo.ancillaryServices.meals.includes(service.id)).toBeTrue();
    expect(component.flightInfo.ancillaryServices.shoppingItems.includes(service.id)).toBeTrue();
  });

  it('should allow to update in-flight services of the flight', () => {
    component.updateDetails(true);
    expect(component.isServiceUpdating).toBeTrue();
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceDialogComponent } from './add-service-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddService } from 'src/app/models/add-service.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AncillaryService } from 'src/app/service/ancillary.service';
import { MaterialModule } from 'src/app/material/material.module';
import { of } from 'rxjs';
import { TestUtility } from 'src/app/utilities/test.utility';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServiceType } from 'src/app/constant/service-type.enum';

describe('AddServiceDialogComponent', () => {
  let component: AddServiceDialogComponent;
  let fixture: ComponentFixture<AddServiceDialogComponent>;
  let mockDialogRef: MatDialogRef<AddServiceDialogComponent>;
  let mockData: { service: AddService, forPassenger: boolean, newPassengerServices: boolean };
  let mockStore: MockStore;
  let mockAncillaryService: jasmine.SpyObj<AncillaryService>;


  beforeEach(async(() => {
    const spyAncillaryService = jasmine.createSpyObj('AncillaryService',
      ['getAllMeals', 'getAllBeverages', 'getAllShoppingItems', 'getMeals', 'getBeverages', 'getShoppingItems']);
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NoopAnimationsModule
      ],
      declarations: [AddServiceDialogComponent],
      providers: [
        provideMockStore(),
        { provide: AncillaryService, useValue: spyAncillaryService },
        {
          provide: MAT_DIALOG_DATA,
          useValue:
          {
            service: { isAdmin: false, meals: [23], beverages: [45], shoppingItems: [12] },
            forPassenger: true,
            newPassengerServices: false
          }
        },
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
    fixture = TestBed.createComponent(AddServiceDialogComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockAncillaryService = TestBed.inject(AncillaryService) as jasmine.SpyObj<AncillaryService>;
    mockData = TestBed.inject(MAT_DIALOG_DATA);
    mockDialogRef = TestBed.inject(MatDialogRef);
    mockStore.overrideSelector('selectedFlight', { flightDetails: TestUtility.setupFlightData() });
    mockAncillaryService.getMeals.and.
      returnValue(of([TestUtility.setUpServiceData()]));
    mockAncillaryService.getBeverages.and.
      returnValue(of([TestUtility.setUpServiceData()]));
    mockAncillaryService.getShoppingItems.and.
      returnValue(of([TestUtility.setUpServiceData()]));
    mockAncillaryService.getAllMeals.and.
      returnValue(of([TestUtility.setUpServiceData()]));
    mockAncillaryService.getAllBeverages.and.
      returnValue(of([TestUtility.setUpServiceData()]));
    mockAncillaryService.getAllShoppingItems.and.
      returnValue(of([TestUtility.setUpServiceData()]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add ancillary services when select', () => {
    const meal = TestUtility.setUpServiceData();
    const beverage = TestUtility.setUpServiceData();
    const item = TestUtility.setUpServiceData();
    component.onSelect(meal, ServiceType.MEALS);
    component.onSelect(beverage, ServiceType.BEVERAGES);
    component.onSelect(item, ServiceType.SHOPPING_ITEMS);
    expect(component.mealsSelected.includes(meal.id)).toBeTruthy();
    expect(component.beveragesSelected.includes(beverage.id)).toBeTruthy();
    expect(component.shoppingItemSelected.includes(item.id)).toBeTruthy();
  });

  it('should remove selected ancillary servicest', () => {
    const meal = TestUtility.setUpServiceData();
    const beverage = TestUtility.setUpServiceData();
    const item = TestUtility.setUpServiceData();
    meal.isSelected = true;
    beverage.isSelected = true;
    item.isSelected = true;
    component.mealsSelected.push(meal.id);
    component.beveragesSelected.push(beverage.id);
    component.shoppingItemSelected.push(item.id);
    fixture.detectChanges();
    component.onSelect(meal, ServiceType.MEALS);
    component.onSelect(beverage, ServiceType.BEVERAGES);
    component.onSelect(item, ServiceType.SHOPPING_ITEMS);
    expect(!component.mealsSelected.includes(meal.id)).toBeTruthy();
    expect(!component.beveragesSelected.includes(beverage.id)).toBeTruthy();
    expect(!component.shoppingItemSelected.includes(item.id)).toBeTruthy();
  });

  it('should close dialog when click save', () => {
    const spyClose = spyOn(mockDialogRef, 'close').and.callFake((result?) => console.log('Close Called with result ' + result));
    component.onSave();
    expect(spyClose).toHaveBeenCalledTimes(1);
  });

  it('should fetch all ancillary data when forPassenger is false', () => {
    component.data.forPassenger = false;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.meals.length !== 0).toBeTruthy();
    expect(component.beverages.length !== 0).toBeTruthy();
    expect(component.shoppingItems.length !== 0).toBeTruthy();
  });

});

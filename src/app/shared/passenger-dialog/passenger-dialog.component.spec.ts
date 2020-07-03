import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerDialogComponent } from './passenger-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Passenger } from 'src/app/models/passenger.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PassengerService } from 'src/app/service/passenger.service';
import { TestUtility } from 'src/app/utilities/test.utility';
import { of } from 'rxjs';
import { AddService } from 'src/app/models/add-service.model';
import { MaterialModule } from 'src/app/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PassengerDialogComponent', () => {
  let component: PassengerDialogComponent;
  let fixture: ComponentFixture<PassengerDialogComponent>;
  let mockDialogRef: MatDialogRef<PassengerDialogComponent>;
  let mockData: { action: string, passenger: Passenger, isUserAdmin: boolean, flightId?: number };
  let mockStore: MockStore;
  let mockPassengerService: jasmine.SpyObj<PassengerService>;
  let mockDialog: MatDialog;

  beforeEach(async(() => {
    const spyPassengerService = jasmine.createSpyObj('PassengerService', ['updatePassengerInfo', 'addPassenger']);
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        FormsModule
      ],
      declarations: [PassengerDialogComponent],
      providers: [
        provideMockStore(),
        { provide: PassengerService, useValue: spyPassengerService },
        {
          provide: MatDialogRef,
          useValue: {
            close: (result?: { action: string }) => { console.log(result.action + ' called'); },
            afterClosed: (() => {
              console.log('After Closed');
              return of({ action: 'Save', result: new AddService(false, [23], [43], [53]) });
            })
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            action: 'Update',
            passenger: TestUtility.setUpPassengerData(), isUserAdmin: false, flightId: 123456
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
    fixture = TestBed.createComponent(PassengerDialogComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector('selectedFlightSeatMap', { seatMap: TestUtility.setUpseatMap() });
    mockDialogRef = TestBed.inject(MatDialogRef);
    mockData = TestBed.inject(MAT_DIALOG_DATA);
    mockPassengerService = TestBed.inject(PassengerService) as jasmine.SpyObj<PassengerService>;
    mockDialog = TestBed.inject(MatDialog);
    mockPassengerService.updatePassengerInfo.and.
      callFake((passenger: Passenger, isSeatChanged?: boolean, oldSeatNumber?: string) => {
        if (isSeatChanged)
          return of(TestUtility.setUpPassengerData(passenger.seatNumber));
        return of(TestUtility.setUpPassengerData());
      });
    mockPassengerService.addPassenger.and.
      callFake((passenger: Passenger) => {
        return of(TestUtility.setUpPassengerData(passenger.seatNumber));
      });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update passenger seat number', () => {
    const spyStore = spyOn(mockStore, 'dispatch').and.callFake(() => { console.log('Action Dispatched'); });
    const spyClose = spyOn(mockDialogRef, 'close').and.callFake((result?: { action: string }) => { console.log(result.action); });
    component.tempPassenger.seatNumber = '1B';
    fixture.detectChanges();
    component.actionClick('Save');
    expect(component.tempPassenger.seatNumber).toBe('1B');
    expect(spyStore).toHaveBeenCalledTimes(1);
    expect(spyClose).toHaveBeenCalled();
  });

  it('should update passenger details, but seat number should be same', () => {
    const spyStore = spyOn(mockStore, 'dispatch').and.callFake(() => { console.log('Action Dispatched'); });
    const spyClose = spyOn(mockDialogRef, 'close').and.callFake((result?: { action: string }) => { console.log(result.action); });
    component.actionClick('Save');
    expect(component.tempPassenger.seatNumber).toBe('1A');
    expect(spyStore).toHaveBeenCalledTimes(1);
    expect(spyClose).toHaveBeenCalled();
  });

  it('should close passenger dialog', () => {
    const spyClose = spyOn(mockDialogRef, 'close').and.callFake((result?: { action: string }) => { console.log(result.action); });
    component.actionClick('Close');
    expect(spyClose).toHaveBeenCalledTimes(1);
  });

  it('should add passenger details', () => {
    const spyStore = spyOn(mockStore, 'dispatch').and.callFake(() => { console.log('Action Dispatched'); });
    const spyClose = spyOn(mockDialogRef, 'close').and.callFake((result?: { action: string }) => { console.log(result.action); });
    component.tempPassenger = {
      ...component.tempPassenger,
      firstName: 'ABC',
      lastName: 'XYZ',
      gender: 'M',
      bagCount: 0,
      seatNumber: '1B',
      flightId: 123456
    };
    fixture.detectChanges();
    mockData.action = 'Add';
    mockData.passenger = null;
    fixture.detectChanges();
    component.actionClick('Save');
    expect(component.tempPassenger.seatNumber).toBe('1B');
    expect(spyStore).toHaveBeenCalledTimes(1);
    expect(spyClose).toHaveBeenCalled();
  });

  it('should open add service dialog', () => {
    const spyOpen = spyOn(mockDialog, 'open').and.returnValue(TestBed.inject(MatDialogRef));
    component.editService();
    expect(spyOpen).toHaveBeenCalled();
  });

});

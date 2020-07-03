import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSeatMapComponent } from './flight-seat-map.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PassengerService } from 'src/app/service/passenger.service';
import { MaterialModule } from 'src/app/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TestUtility } from 'src/app/utilities/test.utility';
import { BottomSheetComponent } from 'src/app/shared/bottom-sheet/bottom-sheet.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('FlightSeatMapComponent', () => {
  let component: FlightSeatMapComponent;
  let fixture: ComponentFixture<FlightSeatMapComponent>;
  let mockStore: MockStore;
  let mockBottomSheet: MatBottomSheet;
  let mockPassengerService: jasmine.SpyObj<PassengerService>;

  beforeEach(async(() => {
    const spyPassengerService = jasmine.createSpyObj('PassengerService', ['getPassengerInfo']);
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        NoopAnimationsModule
      ],
      declarations: [FlightSeatMapComponent],
      providers: [
        provideMockStore(),
        { provide: PassengerService, useValue: spyPassengerService },
        {
          provide: MatBottomSheetRef,
          useValue: {
            close: (result?: { action: string }) => { console.log(result.action + ' called'); }
          }
        },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSeatMapComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector('selectedFlightSeatMap', { seatMap: TestUtility.setUpseatMap() });
    mockBottomSheet = TestBed.inject(MatBottomSheet);
    mockPassengerService = TestBed.inject(PassengerService) as jasmine.SpyObj<PassengerService>;
    mockPassengerService.getPassengerInfo.and.
      returnValue(of(TestUtility.setUpPassengerData()));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open bottom sheet when seat is selected', () => {
    const spyOpen = spyOn(mockBottomSheet, 'open').and.
      returnValue(TestBed.inject(MatBottomSheetRef));
    const seat = component.seatMap.cabins[0].seatRows[0].seats[0];
    component.openSheet(seat);
    expect(spyOpen).toHaveBeenCalledTimes(1);
  });

});

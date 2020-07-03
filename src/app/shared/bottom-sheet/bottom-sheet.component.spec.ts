import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetComponent } from './bottom-sheet.component';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { TestUtility } from 'src/app/utilities/test.utility';
import { PassengerService } from 'src/app/service/passenger.service';
import { Passenger } from 'src/app/models/passenger.model';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BottomSheetComponent', () => {
  let component: BottomSheetComponent;
  let fixture: ComponentFixture<BottomSheetComponent>;
  let mockstore: MockStore;
  let mockBottomRef: MatBottomSheetRef<BottomSheetComponent>;
  let mockRouter: Router;
  let mockRoute: ActivatedRoute;
  let mockPassengerServcie: jasmine.SpyObj<PassengerService>;
  let mockData: Passenger;


  beforeEach(async(() => {
    const spyPassengerServcie = jasmine.createSpyObj('PassengerService', ['updatePassengerInfo']);
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [BottomSheetComponent],
      providers: [
        provideMockStore(),
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: TestUtility.setUpPassengerData() },
        { provide: MatBottomSheetRef, useValue: { dismiss: () => { console.log('Close Called'); } } },
        { provide: PassengerService, useValue: spyPassengerServcie }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomSheetComponent);
    component = fixture.componentInstance;
    mockstore = TestBed.inject(MockStore);
    mockRoute = TestBed.inject(ActivatedRoute);
    mockRouter = TestBed.inject(Router);
    mockPassengerServcie = TestBed.inject(PassengerService) as jasmine.SpyObj<PassengerService>;
    mockBottomRef = TestBed.inject(MatBottomSheetRef);
    mockData = TestBed.inject(MAT_BOTTOM_SHEET_DATA);
    mockPassengerServcie.updatePassengerInfo.and.
      returnValue(of(TestUtility.setUpPassengerData()));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss the bottom sheet after successful updating passenger details', () => {
    const spyStore = spyOn(mockstore, 'dispatch').and.callFake(() => { console.log('Action Dispatched'); });
    const spyDismiss = spyOn(mockBottomRef, 'dismiss').and.callFake(() => { console.log('Bottom Sheet Dismissed'); });
    component.save();
    expect(spyStore).toHaveBeenCalled();
    expect(spyDismiss).toHaveBeenCalled();
  });

});

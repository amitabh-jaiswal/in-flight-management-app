import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';

import { PassengerListComponent } from './passenger-list.component';
import { PassengerService } from 'src/app/service/passenger.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestUtility } from 'src/app/utilities/test.utility';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { FlightSelectComponent } from 'src/app/shared/flight-select/flight-select.component';
import { FilterOptions } from 'src/app/constant/filter-options.enum';

describe('PassengerListComponent', () => {
  let component: PassengerListComponent;
  let fixture: ComponentFixture<PassengerListComponent>;
  let mockPassengerService: jasmine.SpyObj<PassengerService>;
  let mockdDialog: MatDialog;
  let mockStore: MockStore;
  let route: ActivatedRoute;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    const spyPassengerService = jasmine.createSpyObj('PassengerService', ['getFlightPassengers']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MaterialModule
      ],
      declarations: [PassengerListComponent, FlightSelectComponent],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: { queryParamMap: of(jasmine.createSpyObj({ get: 12233 })) } },
        { provide: PassengerService, useValue: spyPassengerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockPassengerService = TestBed.inject(PassengerService) as jasmine.SpyObj<PassengerService>;
    mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData() });
    mockStore.overrideSelector('selectedFlightSeatMap', { seatMap: TestUtility.setUpseatMap() });
    mockdDialog = TestBed.inject(MatDialog);
    route = TestBed.inject(ActivatedRoute);
    loader = TestbedHarnessEnvironment.loader(fixture);
    // spyOn(mockPassengerService, 'getFlightPassengers').and.
    mockPassengerService.getFlightPassengers.and.
      returnValue(of([TestUtility.setUpPassengerData(null, true), TestUtility.setUpPassengerData(), TestUtility.setUpPassengerData()]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter passenger list', async () => {
    const matAutoHarness = await loader.getHarness(MatAutocompleteHarness);
    await matAutoHarness.enterText(FilterOptions.CHECKED_IN);
    await matAutoHarness.selectOption({ text: FilterOptions.CHECKED_IN });
    expect(component.dataSource.filteredData.length === 1).toBeTruthy();
  });

  it('should remove the filter from passenger list', async () => {
    const matAutoHarness = await loader.getHarness(MatAutocompleteHarness);
    await matAutoHarness.enterText(FilterOptions.WHEEL_CHAIR);
    await matAutoHarness.selectOption({ text: FilterOptions.WHEEL_CHAIR });
    await matAutoHarness.enterText(FilterOptions.WITH_INFANT);
    await matAutoHarness.selectOption({ text: FilterOptions.WITH_INFANT });
    await matAutoHarness.enterText(FilterOptions.NOT_CHECKED_IN);
    await matAutoHarness.selectOption({ text: FilterOptions.NOT_CHECKED_IN });
    expect(component.dataSource.filteredData.length === 2).toBeTruthy();
    component.remove(FilterOptions.NOT_CHECKED_IN);
    expect(component.dataSource.filteredData.length === 0).toBeTruthy();
  });

  it('should clear all the filters', async () => {
    const matAutoHarness = await loader.getHarness(MatAutocompleteHarness);
    await matAutoHarness.enterText(FilterOptions.WHEEL_CHAIR);
    await matAutoHarness.selectOption({ text: FilterOptions.WHEEL_CHAIR });
    await matAutoHarness.enterText(FilterOptions.WITH_INFANT);
    await matAutoHarness.selectOption({ text: FilterOptions.WITH_INFANT });
    await matAutoHarness.enterText(FilterOptions.NOT_CHECKED_IN);
    await matAutoHarness.selectOption({ text: FilterOptions.NOT_CHECKED_IN });
    expect(component.selectedFilters.length).toEqual(3);
    component.resetAllFilters();
    expect(component.selectedFilters.length).toEqual(0);
  });

  it('should filter passenger details only by admin', async () => {
    mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData(true) });
    mockStore.refreshState();
    fixture.detectChanges();
    component.ngOnInit();
    const matAutoHarness = await loader.getHarness(MatAutocompleteHarness);
    await matAutoHarness.enterText(FilterOptions.MISSING_ADDRESS);
    await matAutoHarness.selectOption({ text: FilterOptions.MISSING_ADDRESS });
    await matAutoHarness.enterText(FilterOptions.MISSING_DOB);
    await matAutoHarness.selectOption({ text: FilterOptions.MISSING_DOB });
    await matAutoHarness.enterText(FilterOptions.MISSING_PASSPORT);
    await matAutoHarness.selectOption({ text: FilterOptions.MISSING_PASSPORT });
    expect(component.dataSource.filteredData.length === 0).toBeTruthy();
  });

});

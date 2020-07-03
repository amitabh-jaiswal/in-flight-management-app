import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSelectComponent } from './flight-select.component';
import { FlightService } from 'src/app/service/flight.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TestUtility } from 'src/app/utilities/test.utility';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CardComponent } from '../card/card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FlightSelectComponent', () => {
  let component: FlightSelectComponent;
  let fixture: ComponentFixture<FlightSelectComponent>;
  let mockFlightService: jasmine.SpyObj<FlightService>;
  let mockRouter: Router;
  let mockRoute: ActivatedRoute;

  beforeEach(async(() => {
    const spyFlightServive = jasmine.createSpyObj('FlightService', ['getScheduledFlights']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        FlightSelectComponent
        // CardComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of(jasmine.createSpyObj({ get: 12233 })) } },
        { provide: FlightService, useValue: spyFlightServive },
        { provide: Router, useValue: { url: '/flights', navigate: jasmine.createSpy('navigate') } }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSelectComponent);
    component = fixture.componentInstance;
    mockFlightService = TestBed.inject(FlightService) as jasmine.SpyObj<FlightService>;
    mockRoute = TestBed.inject(ActivatedRoute);
    mockRouter = TestBed.inject(Router);
    mockFlightService.getScheduledFlights.and.
      returnValue(of([TestUtility.setupScheduledFlightData(), TestUtility.setupScheduledFlightData()]));
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update flight id in url', () => {
    const flightId = component.scheduledFlights[0].flightId;
    const spyNavigate = mockRouter.navigate as jasmine.Spy;
    component.selectedFlight = flightId;
    fixture.detectChanges();
    component.onSelect();
    const url = spyNavigate.calls.mostRecent().args[1];
    expect(url.queryParams.id).toBe(flightId);
  });

  it('should reset flight id in url', () => {
    const flightId = component.scheduledFlights[0].flightId;
    const spyNavigate = mockRouter.navigate as jasmine.Spy;
    component.selectedFlight = flightId;
    fixture.detectChanges();
    component.onSelect();
    component.onClear();
    const length = spyNavigate.calls.mostRecent().args.length;
    expect(length).toBe(1);
  });

});

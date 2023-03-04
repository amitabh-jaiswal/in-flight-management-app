import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FlightService } from 'src/app/service/flight.service';
import { ScheduledFlight } from 'src/app/models/scheduled-flight.model';
import { Flight } from 'src/app/models/flight.model';
import { AppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { FetchFlightDetails, ClearFlightDetails } from 'src/app/store/actions/flight.action';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToggleLoader } from 'src/app/store/actions/loading.action';
import { HttpError } from 'src/app/store/actions/error.action';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-flight-select',
  templateUrl: './flight-select.component.html',
  styleUrls: ['./flight-select.component.scss']
})
export class FlightSelectComponent implements OnInit {

  selectedFlight: number;
  scheduledFlights: ScheduledFlight[];

  constructor(
    private _store: Store<AppState>,
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._getScheduledFlights();
    this._restoreSelectedFlight();
  }

  private _getScheduledFlights() {
    this._store.dispatch(new ToggleLoader({ isLoading: true, message: 'Fetching Scheduled Flights....' }));
    this.flightService.getScheduledFlights().subscribe((response: ScheduledFlight[]) => {
      this.scheduledFlights = response;
      this._store.dispatch(new ToggleLoader({ isLoading: false }));
    }, (error: Error) => {
      this._store.dispatch(new HttpError(new Notification(error.message, 'HTTP_ERROR', 'ERROR')));
      this._store.dispatch(new ToggleLoader({ isLoading: false, message: 'Fetching Scheduled Flights....' }));
    });
  }

  onSelect() {
    const flightId = this.selectedFlight;
    const url = this.router.url.split('?')[0];
    this.router.navigate([url], { queryParams: { id: flightId } });
  }

  onClear() {
    if (this.selectedFlight)
      this.selectedFlight = undefined;
    const url = this.router.url.split('?')[0];
    this.router.navigate([url]);
  }

  private _restoreSelectedFlight() {
    this.route.queryParamMap.subscribe((queryParam: ParamMap) => {
      this.selectedFlight = +queryParam.get('id');
    });
  }

}

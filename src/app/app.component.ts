import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/state/app.state';
import { AutoLogin } from './store/actions/auth.actions';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FetchFlightDetails, ClearFlightDetails } from './store/actions/flight.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<AppState>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.dispatch(new AutoLogin());
    this._restoreSelectedFlight();
  }

  private _restoreSelectedFlight() {
    this.route.queryParamMap.subscribe((queryParam: ParamMap) => {
      const selectedFlight = +queryParam.get('id');
      console.log(queryParam.get('id'));
      if (selectedFlight)
        this.store.dispatch(new FetchFlightDetails(selectedFlight));
      else
        this.store.dispatch(new ClearFlightDetails());
    });
  }

}

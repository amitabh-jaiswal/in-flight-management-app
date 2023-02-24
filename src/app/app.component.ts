import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/state/app.state';
import { AutoLogin } from './store/actions/auth.actions';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FetchFlightDetails, ClearFlightDetails } from './store/actions/flight.action';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[];
  private _dialogRef: MatDialogRef<any, any>;
  @ViewChild('alertDialog', { static: true }) alertDialog!: TemplateRef<any>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute,
    private _swUpdate: SwUpdate, private _matDialog: MatDialog) { }

  ngOnInit() {
    this.subscriptions = [];
    this.store.dispatch(new AutoLogin());
    this._restoreSelectedFlight();
    if (!environment.production) {
      this._subscribeSwUpdate();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  private _subscribeSwUpdate() {
    this.subscriptions.push(
      this._swUpdate.available.subscribe((event) => {
        this._showUpdateAlert();
      })
    );
  }

  private _showUpdateAlert() {
    this._dialogRef = this._matDialog.open(this.alertDialog, { hasBackdrop: false });
  }

  handleUpdate() {
    this._swUpdate.activateUpdate().then(() => {
      this._dialogRef.close();
      document.location.reload();
    });
  }
}

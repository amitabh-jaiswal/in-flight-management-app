import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/store/state/app.state';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  @Input('message') message;
  @Input('is-loading') isLoading;
  @Input() diameter;
  @Input('subscribe-loader-state') subscribeLoaderState = false;

  private _subscription: Subscription;

  constructor(private _store: Store<AppState>) { }

  ngOnInit(): void {
    if (this.subscribeLoaderState) {
      this._subscription = this._store.select('loading').subscribe((loaderState) => {
        if (loaderState && loaderState.isLoading) {
          this.isLoading = loaderState.isLoading;
          this.message = loaderState.message;
        } else {
          this.isLoading = false;
          this.message = undefined;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

}

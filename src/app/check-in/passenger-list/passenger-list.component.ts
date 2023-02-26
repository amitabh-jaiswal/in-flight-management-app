import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Passenger } from 'src/app/models/passenger.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { PassengerService } from 'src/app/service/passenger.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { startWith, map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state/app.state';
import { UserState } from 'src/app/store/state/user.state';
import { User } from 'src/app/models/user.model';
import { FilterOptions } from 'src/app/constant/filter-options.enum';
import { MatDialog } from '@angular/material/dialog';
import { PassengerDialogComponent } from 'src/app/shared/passenger-dialog/passenger-dialog.component';
import { MatSort } from '@angular/material/sort';
import { ToggleLoader } from 'src/app/store/actions/loading.action';

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.scss']
})
export class PassengerListComponent implements OnInit, OnDestroy {

  displayedColumns: string[];
  dataSource: MatTableDataSource<Passenger>;
  flightSelected: boolean;
  flightId: number;
  filteredValues$: Observable<string[]>;
  options: string[];
  selectedFilters: string[];
  filteredInput: FormControl;
  separatorKeysCodes: number[];
  isUserAdmin: boolean;
  userSubs$: Subscription;
  selectable = true;
  removable = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('filterInput') filterInputRef: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private passengerService: PassengerService,
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this._initializeValues();
    this._getPassengersList();
    // this.filteredValues$ = this.filteredInput.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
    this.dataSource.filterPredicate = (data: Passenger, filterValue: string) => {
      return this._filterPassenger(data, filterValue);
    };
  }

  ngOnDestroy() {
    if (this.userSubs$)
      this.userSubs$.unsubscribe();
  }

  private _getPassengersList() {
    this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      this.flightId = +queryParams.get('id');
      if (this.flightId) {
        this.flightSelected = true;
        this._fetchPassengersList(this.flightId);
      } else {
        this.flightSelected = false;
        this.dataSource.data = [];
        this.selectedFilters = [];
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  openBottomSheet(passenger: Passenger, event: Event) {
    this.store.dispatch(new ToggleLoader({ isLoading: true, message: 'Fetching Passenger Details....' }));
    this.router.navigate([passenger.id], { queryParamsHandling: 'preserve', relativeTo: this.route });
  }

  remove(filteredValue: string) {
    if (this._includes(filteredValue))
      this.selectedFilters.splice(this.selectedFilters.indexOf(filteredValue), 1);
    this._callTableFilter();
  }

  add(event: Event) {
    this.filteredInput.setValue('');
    this.filterInputRef.nativeElement.blur();
    // this.filterInputRef.nativeElement.blur();
  }

  resetAllFilters() {
    this.selectedFilters = [];
    this.filteredInput.setValue('');
    this.filterInputRef.nativeElement.blur();
    this._callTableFilter();
  }

  selected(event: MatAutocompleteSelectedEvent) {
    if (!this._includes(event.option.viewValue))
      this.selectedFilters.push(event.option.viewValue);
    this.filteredInput.setValue('');
    this.filterInputRef.nativeElement.blur();
    this._callTableFilter();
  }

  openPassengerDialog(action: string, event: any, passenger?: Passenger) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PassengerDialogComponent, {
      data: {
        action: action === 'update' ? 'Update' : 'Add',
        passenger: action === 'update' ? passenger : null,
        isUserAdmin: this.isUserAdmin,
        flightId: this.flightId
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.action !== 'Close')
        this._fetchPassengersList(this.flightId);
    });
  }

  addPassenger() {
    this.dialog.open(PassengerDialogComponent, {
      data: {
        action: 'Add',
        passenger: null,
        isUserAdmin: this.isUserAdmin,
        flightId: this.flightId
      }
    });
  }

  private _includes(value: string): boolean {
    return this.selectedFilters.includes(value);
  }

  private _initializeValues() {
    this.isUserAdmin = false;
    this.displayedColumns = ['name', 'gender', 'dob', 'bookingPNR', 'passportNumber', 'seatNumber', 'edit'];
    this.selectedFilters = [];
    this.flightSelected = false;
    this.separatorKeysCodes = [COMMA, ENTER];
    this.filteredInput = new FormControl();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    // this.sort.active = 'seatNumber';
    // this.sort.direction = 'desc';
    // this.dataSource.sort = this.sort;
    this.userSubs$ = this.store.select('user').pipe(
      map((userState: UserState) => userState.user)
    ).subscribe((user: User) => {
      if (user) {
        this.isUserAdmin = user.isAdmin;
        this.options = this._assignOptionsBasedOntheUserRole();
        this.filteredValues$ = this.filteredInput.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
      else
        this.isUserAdmin = false;
    });
  }

  private _filterPassenger(data: Passenger, filtered: string): boolean {
    const filterValues: string[] = filtered.split(',');
    if (!filtered)
      return true;
    else {
      let filterFlag = false;
      filterValues.forEach(option => {
        if (option === FilterOptions.CHECKED_IN) {
          if (data.checkedIn)
            filterFlag = true;
        }
        else if (option === FilterOptions.NOT_CHECKED_IN) {
          if (!data.checkedIn)
            filterFlag = true;
        }
        else if (option === FilterOptions.WHEEL_CHAIR) {
          if (data.wheelChair)
            filterFlag = true;
        }
        else if (option === FilterOptions.WITH_INFANT) {
          if (data.withInfant)
            filterFlag = true;
        }
        else if (option === FilterOptions.MISSING_ADDRESS) {
          if (!data.address)
            filterFlag = true;
        }
        else if (option === FilterOptions.MISSING_DOB) {
          if (!data.dob)
            filterFlag = true;
        }
        else if (option === FilterOptions.MISSING_PASSPORT)
          if (!data.passportNumber)
            filterFlag = true;
      });
      return filterFlag;
    }
  }

  private _callTableFilter() {
    let filterValue = '';
    this.selectedFilters.forEach((option, index) => {
      if (index > 0)
        filterValue += ',' + option;
      else
        filterValue += option;
    });
    this.dataSource.filter = filterValue;
  }

  private _assignOptionsBasedOntheUserRole(): string[] {
    return this.isUserAdmin ? [FilterOptions.MISSING_PASSPORT, FilterOptions.MISSING_DOB, FilterOptions.MISSING_ADDRESS] :
      [FilterOptions.CHECKED_IN, FilterOptions.NOT_CHECKED_IN, FilterOptions.WHEEL_CHAIR, FilterOptions.WITH_INFANT];
  }

  private _fetchPassengersList(flightId: number) {
    this.passengerService.getFlightPassengers(flightId).subscribe((response: Passenger[]) => {
      this.dataSource.data = response;
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceDetail } from '../models/service-detail.model';
import { ANCILLARY_DATA } from '../utilities/url';

@Injectable({
  providedIn: 'root'
})
export class AncillaryService {

  constructor(private http: HttpClient) { }

  getMeals(mealIds: number[]): Observable<ServiceDetail[]> {
    const ids = this._makeQueryParams(mealIds);
    return this.http.get<ServiceDetail[]>(ANCILLARY_DATA.MEALS_API + ids);
  }

  getBeverages(beveragesId: number[]): Observable<ServiceDetail[]> {
    const ids = this._makeQueryParams(beveragesId);
    return this.http.get<ServiceDetail[]>(ANCILLARY_DATA.BEVERAGES_API + ids);
  }

  getShoppingItems(itemIds: number[]): Observable<ServiceDetail[]> {
    const ids = this._makeQueryParams(itemIds);
    return this.http.get<ServiceDetail[]>(ANCILLARY_DATA.SHOPPING_ITEMS_API + ids);
  }

  getAllMeals(): Observable<ServiceDetail[]> {
    return this.http.get<ServiceDetail[]>(ANCILLARY_DATA.MEALS_API);
  }

  getAllBeverages(): Observable<ServiceDetail[]> {
    return this.http.get<ServiceDetail[]>(ANCILLARY_DATA.BEVERAGES_API);
  }

  getAllShoppingItems(): Observable<ServiceDetail[]> {
    return this.http.get<ServiceDetail[]>(ANCILLARY_DATA.SHOPPING_ITEMS_API);
  }

  private _makeQueryParams(servieIds: number[]): string {
    let ids = '?';
    servieIds.forEach((id, index) => {
      if (index > 0)
        ids += '&';
      ids += 'id=' + id;
    });
    return ids;
  }

}

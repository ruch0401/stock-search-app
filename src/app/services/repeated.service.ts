import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {LatestStockPrice} from "../models/latest-stock-price";
import {BASE_URL} from "../models/baseurl";
import {HistoricalData} from "../models/historical-data";
import {TickerAutocompleteTags} from "../models/autocomplete";

@Injectable({
  providedIn: 'root'
})
export class RepeatedService {

  private httpClient: HttpClient;

  constructor(private handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error.message || 'Server Error');
  }

  getTickerAutocompleteDetails(
    query: string
  ): Observable<TickerAutocompleteTags[]> {
    const _url: string = `${BASE_URL}/company/autocomplete?q=${query}`;
    return this.httpClient.get<TickerAutocompleteTags[]>(_url);
  }

  getLatestStockPrice(query: string): Observable<LatestStockPrice> {
    const _url: string = `${BASE_URL}/company/latest-stock-price?symbol=${query}`;
    return this.httpClient.get<LatestStockPrice>(_url).pipe(catchError(this.errorHandler));
  }

  getHourlyData(
    query: string,
    resolution: string,
    from: number,
    to: number
  ): Observable<HistoricalData> {
    const _url: string = `${BASE_URL}/company/historical/data?symbol=${query}&resolution=${resolution}&from=${from}&to=${to}`;
    return this.httpClient.get<HistoricalData>(_url).pipe(catchError(this.errorHandler));
  }
}

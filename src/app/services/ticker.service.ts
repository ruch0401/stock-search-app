import {HttpClient, HttpErrorResponse, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TickerAutocompleteTags} from '../models/autocomplete';
import {BASE_URL} from '../models/baseurl';
import {catchError, Observable, throwError} from 'rxjs';
import {TickerData} from '../models/ticker-data';
import {LatestStockPrice} from '../models/latest-stock-price';
import {CompanyNews} from '../models/company-news';
import {SocialSentiment} from '../models/social-sentiment';
import {HistoricalData} from '../models/historical-data';
import {Recommendation} from '../models/recommendation';
import {Eps} from '../models/eps';

@Injectable({
  providedIn: 'root',
})
export class TickerService {
  constructor(private http: HttpClient) {
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error.message || 'Server Error');
  }

  getTickerDetails(query: string): Observable<TickerData> {
    const _url: string = `${BASE_URL}/company/description?symbol=${query}`;
    return this.http.get<TickerData>(_url).pipe(catchError(this.errorHandler));
  }

  getPeers(query: string): Observable<string[]> {
    const _url: string = `${BASE_URL}/company/peers?symbol=${query}`;
    return this.http.get<string[]>(_url).pipe(catchError(this.errorHandler));
  }

  getCompanyNews(
    query: string,
    from: Date,
    to: Date,
    count: number,
    filter: string
  ): Observable<CompanyNews[]> {
    const _url: string = `${BASE_URL}/company/news?symbol=${query}&from=${from}&to=${to}&count=${count}&filter=${filter}`;
    return this.http.get<CompanyNews[]>(_url).pipe(catchError(this.errorHandler));
  }

  getSocialSentiment(query: string, from: any): Observable<SocialSentiment> {
    const _url: string = `${BASE_URL}/company/social-sentiment?symbol=${query}&from=${from}`;
    return this.http.get<SocialSentiment>(_url).pipe(catchError(this.errorHandler));
  }

  getHistoricalData(
    query: string,
    resolution: string,
    from: number,
    to: number
  ): Observable<HistoricalData> {
    const _url: string = `${BASE_URL}/company/historical/data?symbol=${query}&resolution=${resolution}&from=${from}&to=${to}`;
    return this.http.get<HistoricalData>(_url).pipe(catchError(this.errorHandler));
  }

  getRecommendationData(query: string): Observable<Recommendation> {
    const _url: string = `${BASE_URL}/company/recommendation-trends?symbol=${query}`;
    return this.http.get<Recommendation>(_url).pipe(catchError(this.errorHandler));
  }

  getEps(query: string): Observable<Eps> {
    const _url: string = `${BASE_URL}/company/stock/earnings?symbol=${query}`;
    return this.http.get<Eps>(_url).pipe(catchError(this.errorHandler));
  }
}

// @ts-nocheck
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiDataEventService {

  public _apiEventSubject = new BehaviorSubject<any[]>([]);

  constructor() { }

  emit<T>(data: T) {
    let modifiedData = this._apiEventSubject.getValue();
    let index = this._apiEventSubject.getValue().findIndex(o => o.key === data.key);
    if (index === -1) {
      modifiedData.push(data);
    } else {
      modifiedData[index].key = data.key;
      modifiedData[index].value = data.value;
    }
    this._apiEventSubject.next(modifiedData);
  }

  on<T>(): Observable<T[]> {
    return this._apiEventSubject.asObservable();
  }

  get() {
    return this._apiEventSubject.getValue();
  }

  clear() {
    this._apiEventSubject.next([]);
  }
}

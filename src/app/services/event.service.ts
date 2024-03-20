import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public _eventSubject = new BehaviorSubject<any>('');

  constructor() { }

  emit<T>(data: T) {
    this._eventSubject.next(data);
  }

  on<T>(): Observable<T> {
    return this._eventSubject.asObservable();
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeStoreService {

  public timeStore = new BehaviorSubject<number>(Math.floor(Date.now() / 1000));

  constructor() {
  }

  setTime(time: number) {
    this.timeStore.next(time);
  }

  getTime() {
    return this.timeStore.asObservable();
  }
}

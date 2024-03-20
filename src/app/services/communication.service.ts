import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private subject = new Subject<any>();

  sendMessage(message: object) {
    this.subject.next(message);
  }

  onMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

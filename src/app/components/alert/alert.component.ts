import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/models/alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnChanges {
  @ViewChild('alertRef') alertRef: NgbAlert;
  @Input('alert') public alertTemp: Alert;

  public showAlert: boolean;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const alertDataChange = changes['alertTemp'];
    if (alertDataChange) {
      if (this.alertTemp.selfClosing) {
        console.log(`The alert is self-closing and hence will close after ${this.alertTemp.closeAfter} seconds`);
        setTimeout(() => {
          this.showAlert = false;
          if (this.showAlert) this.alertRef.close();
        }, this.alertTemp.closeAfter * 1000);
        console.log(`Going to close the alert now as ${this.alertTemp.closeAfter} time has elapsed`);
      } else {
        console.log(`Alert: ${this.alertTemp.message} is of type selfClosing = ${this.alertTemp.selfClosing}`);
      }
    }
  }

  ngOnInit(): void {
    this.showAlert = true;
  }

  customClose() {
    console.log(`Alert Closed: ${JSON.stringify(this.alertTemp)}`);
  }
}

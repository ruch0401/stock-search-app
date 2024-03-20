import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CompanyNews} from 'src/app/models/company-news';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-top-news-tab',
  templateUrl: './top-news-tab.component.html',
  styleUrls: ['./top-news-tab.component.css'],
})
export class TopNewsTabComponent implements OnInit {
  @ViewChild('newscard') newscard: ElementRef;
  clickedElement: Subscription = new Subscription();
  closeResult: string;

  @Input('companyNewsFromTab') public companyNewsFromTab: CompanyNews[];

  constructor(private modalService: NgbModal, private datePipe: DatePipe) {}

  open(content: any, item: CompanyNews) {
    this.modalService
      .open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    const customSource = document.getElementById('custom-source');
    const customPublishedDate = document.getElementById(
      'custom-published-date'
    );
    const customTitle = document.getElementById('custom-title');
    const customDescription = document.getElementById('custom-description');
    const customUrl = document.getElementById('custom-url');
    const twitterShareButton = document.getElementById('twitter-share-button');
    const facebookShareButton = document.getElementById(
      'facebook-share-button'
    );

    if (
      customSource &&
      customPublishedDate &&
      customTitle &&
      customDescription &&
      customUrl &&
      twitterShareButton &&
      facebookShareButton
    ) {
      customSource.innerHTML = item.source;
      customPublishedDate.innerHTML = `${this.convertTimestampToDate(item.datetime)}`;
      customTitle.innerHTML = item.headline;
      customDescription.innerHTML = item.summary;
      customUrl.innerHTML = `For more details click <a href="${item.url}" target="_blank">here</a>.`;

      // handling social media sharing - twitter
      const tweet = `${item.headline}\n`;
      twitterShareButton.innerHTML = `<a
        class="m-0 p-0 d-inline-flex twitter-share-button btn btn-social btn-twitter" href="https://twitter.com/intent/tweet?text=${tweet}&url=${item.url}" target="_blank" data-size="large">
        <i class="mr-2 p-0 fa fa-2x fa-twitter" style="color: #1DA1F2"></i>
       </a>`;

      // handling social media sharing - facebook
      const fbPost = `https://www.facebook.com/sharer/sharer.php?u=${item.url}&src=sdkpreparse`;
      facebookShareButton.innerHTML = `<div
        class="m-0 mx-1 p-0 d-inline-flex btn fb-share-button"
        data-href="https://developers.facebook.com/docs/plugins/"
        data-layout="button"
        data-size="large"
        >
        <a target="_blank" href="${fbPost}" class="fb-xfbml-parse-ignore">
        <i class="m-0 p-0 fa fa-2x fab fa-facebook-square" style="color: #0000FF"></i>
        </a>
        </div>`;

    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private convertTimestampToDate(t?: string): any {
    if (typeof t !== 'undefined') {
      return this.datePipe.transform(t + '000', 'MMMM d, y');
    }
    return null;
  }

  ngOnInit(): void {
  }
}

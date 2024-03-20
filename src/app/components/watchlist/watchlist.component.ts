import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {TickerService} from "../../services/ticker.service";
import {WatchlistItem} from "../../models/watchlist-item";
import {RepeatedService} from "../../services/repeated.service";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  @ViewChild('warning') warning: ElementRef;
  @ViewChild('closeablecard') closeablecard: ElementRef;
  clickedElement: Subscription = new Subscription();

  public watchlistArr: WatchlistItem[];
  public isWatchlistEmpty: boolean;

  constructor(private router: Router, private tickerService: TickerService, private repeatedService: RepeatedService) {}

  getLatestStockPrice(watchlistItem: WatchlistItem) {
    let ticker = watchlistItem.ticker;
    this.repeatedService.getLatestStockPrice(ticker).subscribe((data) => {
      watchlistItem.currentPrice = data.c;
      watchlistItem.changeInPrice = data.d;
      watchlistItem.percentageChangeInPrice = data.dp;
    })
  }

  ngOnInit(): void {
    this.getWatchlistViewData();
  }

  getWatchlistViewData() {
    this.watchlistArr = JSON.parse(localStorage.getItem('watchlisted') || '[]');
    this.isWatchlistEmpty = this.watchlistArr.length === 0;
    this.watchlistArr.forEach((item: WatchlistItem) => {
      this.getLatestStockPrice(item);
    })
  }

  viewCard(ticker: string) {
    this.router.navigateByUrl(`/search/${ticker}`);
  }

  removeFromWatchlist(watchlistItem: WatchlistItem) {
    console.log(`${JSON.stringify(watchlistItem)} is being removed`);
    let watchlistArr: WatchlistItem[] = JSON.parse(localStorage.getItem('watchlisted') || '[]');
    let index = watchlistArr.findIndex((obj: WatchlistItem) => obj.ticker === watchlistItem.ticker);
    watchlistArr.splice(index, 1);
    localStorage.setItem('watchlisted', JSON.stringify(watchlistArr));

    // Todo: Fix attempt for showing the warning via DOM manipulation or Page reload
    // Related to https://piazza.com/class/kxindf11ki56s2?cid=722
    const card = document.getElementById(`card-${watchlistItem.ticker}`);
    if (card) {
      card.style.display = 'none';
      if (JSON.parse(localStorage.getItem('watchlisted') || '[]').length === 1) {
        this.warning.nativeElement.style.display = 'visible';
      }
    }

    this.getWatchlistViewData();
  }
}

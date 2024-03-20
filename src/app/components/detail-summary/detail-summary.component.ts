// @ts-nocheck
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LatestStockPrice} from 'src/app/models/latest-stock-price';
import {TickerData} from 'src/app/models/ticker-data';
import {DatePipe} from '@angular/common';
import {Alert} from 'src/app/models/alert';
import {ActivatedRoute} from '@angular/router';
import {TickerService} from 'src/app/services/ticker.service';
import {CompanyNews} from 'src/app/models/company-news';
import {Eps} from 'src/app/models/eps';
import {HistoricalData} from 'src/app/models/historical-data';
import {Recommendation} from 'src/app/models/recommendation';
import {SocialSentiment} from 'src/app/models/social-sentiment';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoaderService} from "../../services/loader.service";
import {lastValueFrom, map, Observable, Subscription, timer} from "rxjs";
import {WatchlistItem} from "../../models/watchlist-item";
import {TimeStoreService} from "../../services/time-store.service";
import {RepeatedService} from "../../services/repeated.service";
import {ApiDataEventService} from "../../services/api-data-event.service";

@Component({
  selector: 'app-detail-summary',
  templateUrl: './detail-summary.component.html',
  styleUrls: ['./detail-summary.component.css'],
})
export class DetailSummaryComponent implements OnInit {
  @ViewChild('alertcolwatchlist') public alertcolwatchlist: ElementRef;
  @ViewChild('alertcolportfolio') public alertcolportfolio: ElementRef;

  // Variables for conditional rendering of HTML components
  public isWatchlisted: boolean;
  public isPortfolioed: boolean;
  public showDetails: boolean = false;
  public isMarketOpen: boolean;
  public closeResult: string;

  // Data fetched from the API
  public companyDetails: TickerData = {} as TickerData;
  public latestStockPrice: LatestStockPrice = {} as LatestStockPrice;
  public peers: string[] = [];
  public companyNews: CompanyNews[] = [];
  public socialSentiment: SocialSentiment = {} as SocialSentiment;
  public historicalData: HistoricalData = {} as HistoricalData;
  public hourlyData: HistoricalData = {} as HistoricalData;
  public historicalDataForSummary: HistoricalData = {} as HistoricalData;
  public recommendationData: Recommendation = {} as Recommendation;
  public eps: Eps = {} as Eps;

  // Variables - Alerts
  public watchlistedAlert: Alert = {} as Alert;
  public portfolioAlert: Alert = {} as Alert;

  // Variables - Portfolio management
  public stockQuantity: number = 0;
  public walletBalance: number = parseFloat(localStorage.getItem('walletBalance') || '25000');
  public currentPrice: number;
  public isBuying: boolean;

  // Variable - Miscellaneous
  public testSubscription: Subscription;
  public currentTime: any;
  public isError: boolean;
  public errorMessage: string;
  public modalIntervalId: number;
  public defaultErrorMessage: string = "Something went wrong. Please view the developer console for more details.";


  constructor(
    public datePipe?: DatePipe,
    public route?: ActivatedRoute,
    public tickerService?: TickerService,
    public modalService?: NgbModal,
    public loaderService?: LoaderService,
    public timeStoreService: TimeStoreService,
    public repeatedService: RepeatedService,
    public apiDataEventService: ApiDataEventService
  ) {
  }

  // Subscribing to the observable returned by the /company/latest-stock-price API
  getCompanyDetails(ticker: any) {
    this.tickerService?.getTickerDetails(ticker).subscribe(
      data => {
        if (data.ticker === undefined) {
          console.log('Ticker data is undefined');
          this.isError = true;
          this.errorMessage = 'No data found. Please enter a valid Ticker';
        } else {
          Object.assign(this.companyDetails, data);
          // Emitting data to a behaviour subject
          let obj = {
            key: "companyDetails",
            value: data,
          }
          this.apiDataEventService.emit(obj);
        }
      },
      error => this.isError = true);
  }

  // latestStockData is available here inside subscribe. hence, collecting it for next API call
  getLatestStockPrice(ticker: any) {
    this.repeatedService?.getLatestStockPrice(ticker).subscribe(
      (data) => {
        Object.assign(this.latestStockPrice, data);
        // Emitting data to a behaviour subject
        let obj = {
          key: "latestStockPrice",
          value: data,
        }
        this.apiDataEventService.emit(obj);
        this.currentPrice = data.c; // Updating the current price again so that the global variable gets it and the modal gets updated

        // check whether the market is open or closed
        this.currentTime = Date.now();
        const lastStockFetchedTime = parseInt(this.latestStockPrice.t) * 1000;
        this.isMarketOpen = this.currentTime - lastStockFetchedTime < 300 * 1000;

        if (!this.isMarketOpen) {
          console.log(
            'More than 5 mins elapsed since stock details fetched. Assuming that the market is closed',
            new Date(this.currentTime),
            new Date(lastStockFetchedTime)
          );
          this.testSubscription.unsubscribe();
        }

        // Fetching hourly data, making use of BehaviourSubject to store the historyDataTo value in a service so that it
        // is available globally across the entire application once the service has been added to the component using
        // dependency injection
        let historyDataTo = parseInt(this.latestStockPrice.t);
        let hourlyDataFrom = historyDataTo - 6 * 60 * 60;
        this.timeStoreService.setTime(historyDataTo);
        const resolutionHourly = '5';
        this.repeatedService
          ?.getHourlyData(ticker, resolutionHourly, hourlyDataFrom, historyDataTo)
          .subscribe((data) => {
            this.hourlyData = data;
            // Emitting data to a behaviour subject
            let obj = {
              key: "hourlyData",
              value: data,
            }
            this.apiDataEventService.emit(obj);
          });
      },
      error => this.isError = true);
  }

  getHistoryData(ticker: string) {
    const resolutionSMA_Volume = 'D';
    let historyDataTo;
    this.timeStoreService.getTime().subscribe(time => historyDataTo = time);
    let historyDataFrom = historyDataTo - 2 * 365 * 24 * 60 * 60;
    this.tickerService
      ?.getHistoricalData(ticker, resolutionSMA_Volume, historyDataFrom, historyDataTo)
      .subscribe((data) => {
        this.historicalData = data;
        // Emitting data to a behaviour subject
        let obj = {
          key: "historicalData",
          value: data,
        }
        this.apiDataEventService.emit(obj);
      }, error => this.isError = true);
  }

  // Subscribing to the observable returned by the /company/peers API
  getPeers(ticker: any) {
    this.tickerService?.getPeers(ticker).subscribe(
      (data) => {
        this.peers = data.map((d) => d)
        // Emitting data to a behaviour subject
        let obj = {
          key: "peers",
          value: data,
        }
        this.apiDataEventService.emit(obj);
      },
      error => this.isError = true);
  }

  // Subscribing to the observable returned by the /company/news API
  getCompanyNews(ticker: any) {
    const newsDateArray = this.getDateIntervalForNews();
    const newsItemsToDisplay = 20;
    const filter = 'true';
    this.tickerService
      ?.getCompanyNews(
        ticker,
        newsDateArray[0],
        newsDateArray[1],
        newsItemsToDisplay,
        filter
      )
      .subscribe(
        data => {
          this.companyNews = data.map((d) => d)
          // Emitting data to a behaviour subject
          let obj = {
            key: "companyNews",
            value: data.map((d) => d),
          }
          this.apiDataEventService.emit(obj);
        },
        error => this.isError = true);
  }

  // Subscribing to the observable returned by the /company/social-sentiment API
  getSocialSentiment(ticker: any) {
    const startDate = this.datePipe?.transform('2022-01-01', 'yyyy-MM-dd');
    this.tickerService
      ?.getSocialSentiment(ticker, startDate)
      .subscribe((data) => {
        this.socialSentiment = data;
        // Emitting data to a behaviour subject
        let obj = {
          key: "socialSentiment",
          value: data,
        }
        this.apiDataEventService.emit(obj);
      }, error => this.isError = true);
  }

  // Subscribing to the observable returned by the /company/recommendation-trends API
  getRecommendationData(ticker: any) {
    this.tickerService?.getRecommendationData(ticker).subscribe((data) => {
      this.recommendationData = data;
      // Emitting data to a behaviour subject
      let obj = {
        key: "recommendationData",
        value: data,
      }
      this.apiDataEventService.emit(obj);
    }, error => this.isError = true);
  }

  // Subscribing to the observable returned by the /company/recommendation-trends API
  getEps(ticker: any) {
    this.tickerService?.getEps(ticker).subscribe((data) => {
      this.eps = data;
      // Emitting data to a behaviour subject
      let obj = {
        key: "eps",
        value: data,
      }
      this.apiDataEventService.emit(obj);
    }, error => this.isError = true);
  }

  ngOnInit(): void {
    this.route?.paramMap.subscribe((params) => {
      let ticker = params.get('ticker');
      this.isError = false;
      this.showDetails = ticker !== 'home';
      if (ticker !== 'home') {
        this.isWatchlisted = this.checkIfWatchlisted(ticker);
        this.isPortfolioed = this.checkIfPortfolioed(ticker);
        let lastSearchedStock = localStorage.getItem('lastSearchedStock');
        if (ticker !== lastSearchedStock || lastSearchedStock === 'home') {
          console.log(`LastSearchedStock: ${lastSearchedStock}, CurrentSearchedStock: ${ticker}`)
          if (this.testSubscription) {
            this.testSubscription.unsubscribe();
          }
        }
        localStorage.setItem('lastSearchedStock', ticker);
        this.init(ticker);
      }
    });
  }

  init(ticker: string) {
    let arr = this.apiDataEventService.get();
    console.log("Init called for new search", this.companyDetails, this.companyNews);
    let index = arr.findIndex(o => o.key === 'companyDetails');
    if (index !== -1 && arr[index].value.ticker === ticker) {
      console.log(`Data already present for ticker ${ticker} : `, arr);
      this.companyDetails = arr[arr.findIndex(o => o.key === 'companyDetails')].value;
      this.latestStockPrice = arr[arr.findIndex(o => o.key === 'latestStockPrice')].value;
      this.hourlyData = arr[arr.findIndex(o => o.key === 'hourlyData')].value;
      this.historicalData = arr[arr.findIndex(o => o.key === 'historicalData')].value;
      this.peers = arr[arr.findIndex(o => o.key === 'peers')].value;
      this.companyNews = arr[arr.findIndex(o => o.key === 'companyNews')].value;
      this.socialSentiment = arr[arr.findIndex(o => o.key === 'socialSentiment')].value;
      this.recommendationData = arr[arr.findIndex(o => o.key === 'recommendationData')].value;
      this.eps = arr[arr.findIndex(o => o.key === 'eps')].value;
      this.testSubscription = timer(0, 15000).subscribe(() => {
        this.getLatestStockPrice(ticker);
      });
    } else {
      this.getCompanyDetails(ticker);
      this.testSubscription = timer(0, 15000).subscribe(() => {
        this.getLatestStockPrice(ticker);
      });
      this.getHistoryData(ticker);
      this.getPeers(ticker);
      this.getCompanyNews(ticker);
      this.getSocialSentiment(ticker);
      this.getRecommendationData(ticker);
      this.getEps(ticker);
    }
  }

  getDateIntervalForNews(): any[] {
    let to = Date.now();
    let from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDateString = this.datePipe?.transform(to, 'yyyy-MM-dd');
    const fromDateString = this.datePipe?.transform(from, 'yyyy-MM-dd');
    return [fromDateString, toDateString];
  }

  convertTimestampToDate(t?: string): any {
    if (typeof t !== 'undefined') {
      return this.datePipe?.transform(t + '000', 'yyyy-MM-dd HH:mm:ss');
    }
    return null;
  }

  watchlistStock(query: any) {
    let watchlistArr: WatchlistItem[];
    // Create an alert depending on whether the ticker is being watchlisted or un-watchlisted
    this.watchlistedAlert = this.createAlertForWatchlisting(query);
    this.alertcolwatchlist.nativeElement.style.display = 'block';

    this.isWatchlisted = this.checkIfWatchlisted(query);
    this.isWatchlisted = !this.isWatchlisted
    if (this.isWatchlisted) {
      const watchlistItem: WatchlistItem = {
        ticker: this.companyDetails.ticker,
        tickerName: this.companyDetails.name,
        currentPrice: this.latestStockPrice.c,
        changeInPrice: this.latestStockPrice.d,
        percentageChangeInPrice: this.latestStockPrice.dp,
      };
      watchlistArr = JSON.parse(localStorage.getItem('watchlisted') || '[]');
      console.log('The watchlisted item is ', watchlistItem);
      watchlistArr.push(watchlistItem);
    } else {
      watchlistArr = JSON.parse(localStorage.getItem('watchlisted') || '[]');
      const index = watchlistArr.findIndex((watchlistItem) => {
        return watchlistItem.ticker === query;
      });
      watchlistArr.splice(index, 1);
    }
    localStorage.setItem('watchlisted', JSON.stringify(watchlistArr));
  }

  removeAlertFromDom() {
    this.alertcolwatchlist.nativeElement.style.display = 'none';
    this.alertcolportfolio.nativeElement.style.display = 'none';
  }

  createAlertForWatchlisting(ticker: string) {
    let alert: Alert;
    if (this.isWatchlisted) {
      alert = new Alert('danger', `${ticker} removed from Watchlist`, true, 5, true);
      console.log('This stock has been removed from watchlist');
    } else {
      alert = new Alert('success', `${ticker} added to Watchlist`, true, 5, true);
      console.log('This stock has been watchlisted');
    }
    return alert;
  }

  checkIfWatchlisted(t: any) {
    let watchlistArrTemp = JSON.parse(localStorage.getItem('watchlisted') || '[]');
    let index = watchlistArrTemp.findIndex((watchlistItem: { ticker: any; }) => {
      return watchlistItem.ticker === t;
    });
    return index !== -1;
  }

  checkIfPortfolioed(t: any) {
    let isportfolioed: boolean = false;
    let arr = JSON.parse(localStorage.getItem('portfolio') || '[]');

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].ticker === t) {
        isportfolioed = true;
      }
    }
    return isportfolioed;
  }

  open(content: any, ticker: string, currentPrice: number, isBuying: boolean) {

    this.modalService?.open(content, {ariaLabelledBy: 'ticker'}).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    this.isBuying = isBuying;
    const tickerElem = document.getElementById('custom-ticker');
    const currentPriceElem = document.getElementById('custom-current-price');
    const moneyInWalletElem = document.getElementById('custom-money-in-wallet');
    const totalElem = document.getElementById('custom-total');
    let quantity = document.getElementById('custom-quantity');
    this.currentPrice = currentPrice;

    if (tickerElem && currentPriceElem && moneyInWalletElem && totalElem && quantity) {
      tickerElem.innerHTML = ticker;
      currentPriceElem.innerHTML = `Current Price: ${this.currentPrice.toFixed(2)}`;
      this.modalIntervalId = setInterval(() => {
        currentPriceElem.innerHTML = `Current Price: ${this.currentPrice.toFixed(2)}`;
      }, 15000);
      quantity.focus();
      moneyInWalletElem.innerHTML = `Money in Wallet: $${this.walletBalance.toFixed(2)}`;
    }
  }

  getStockQuantityForTicker(param: any): number {
    // Identify query ticker from `this` component instance
    let query = param.companyDetails.ticker;
    let portfolioGroups = JSON.parse(
      localStorage.getItem('portfolio') || '[]'
    );
    let index = portfolioGroups.findIndex((o: { ticker: any; }) => o.ticker === query);
    return index === -1 ? 0 : portfolioGroups[index].quantity;
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addToPortfolio(param: any) {
    // Identify query ticker from `this` component instance
    let query = param.companyDetails.ticker;

    // Create alert for successful sell of stock in portfolio
    this.portfolioAlert = new Alert('success', `${query} bought successfully.`, true, 5, true);
    this.alertcolportfolio.nativeElement.style.display = 'block';

    // Create buying transaction
    let quantity = parseInt((<HTMLInputElement>document.getElementById('custom-quantity'))?.value);
    let currentPrice = param.latestStockPrice.c;
    let portfolioGroups = JSON.parse(localStorage.getItem('portfolio') || '[]');

    // When the user has opened a modal and clicked on BUY, the buy will always be successful as all the edge cases have been handled as frontend
    // validations. Hence, updating the walletBalance.
    let currentWalletBalance = parseFloat(localStorage.getItem('walletBalance') || '25000');
    localStorage.setItem('walletBalance', JSON.stringify(currentWalletBalance - quantity * currentPrice));
    this.walletBalance = parseFloat(localStorage.getItem('walletBalance') || '0');

    // Continuing with transaction creation.
    let index = portfolioGroups.findIndex((portfolio: { ticker: any; }) => portfolio.ticker === query);
    if (index === -1) {
      const transaction = {
        ticker: query,
        tickerName: this.companyDetails.name,
        quantity: quantity,
        totalCost: parseFloat((quantity * currentPrice).toFixed(2)),
      }
      portfolioGroups.push(transaction);
    } else {
      portfolioGroups[index].quantity += quantity;
      portfolioGroups[index].totalCost += parseFloat((quantity * currentPrice).toFixed(2));
    }

    // Add resulting portfolioGroup array to localstorage
    localStorage.setItem('portfolio', JSON.stringify(portfolioGroups))

    // Update isPortfolioed flag so that the SELL button can be displayed
    this.isPortfolioed = true;

    // remove interval that was put in place for live reload of data
    console.log(`Destroying the modal interval with id ${this.modalIntervalId}`);
    clearInterval(this.modalIntervalId);

    // Close the modal programmatically
    this.modalService?.dismissAll();
  }

  removeFromPortfolio(param: any) {
    // Identify query ticker from `this` component instance
    let query = param.companyDetails.ticker;

    // Create alert for successful sell of stock in portfolio
    this.portfolioAlert = new Alert('danger', `${query} sold successfully.`, true, 5, true);
    this.alertcolportfolio.nativeElement.style.display = 'block';

    // Create selling transaction
    let sellingQuantity = parseInt((<HTMLInputElement>document.getElementById('custom-quantity'))?.value);
    let sellingCurrentPrice = param.latestStockPrice.c;
    let portfolioGroups = JSON.parse(localStorage.getItem('portfolio') || '[]');

    // When the user has opened a modal and clicked on SELL, the sell will always be successful as all the edge cases have been handled as frontend
    // validations. Hence, updating the walletBalance.
    let currentWalletBalance = parseFloat(localStorage.getItem('walletBalance') || '25000');
    localStorage.setItem('walletBalance', JSON.stringify(currentWalletBalance + sellingQuantity * sellingCurrentPrice));
    this.walletBalance = parseFloat(localStorage.getItem('walletBalance') || '0');

    // Continuing with transaction creation.
    let index = portfolioGroups.findIndex((portfolio: { ticker: any; }) => portfolio.ticker === query);

    // We are sure that we will always find the index. Hence, not checking for -1 index condition
    if (portfolioGroups[index].quantity === sellingQuantity) {
      portfolioGroups.splice(index, 1);
      // If all stocks have been sold, then set the portfolioed flag to false;
      this.isPortfolioed = false;
    } else {
      portfolioGroups[index].quantity -= sellingQuantity;
      portfolioGroups[index].totalCost -= parseFloat((sellingQuantity * sellingCurrentPrice).toFixed(2));
    }

    // Add resulting portfolioGroup array to localstorage
    localStorage.setItem('portfolio', JSON.stringify(portfolioGroups))

    // remove interval that was put in place for live reload of data
    console.log(`Destroying the modal interval with id ${this.modalIntervalId}`);
    clearInterval(this.modalIntervalId);

    // Close the modal programmatically
    this.modalService?.dismissAll();
  }

  ngOnDestroy() {
    if (this.testSubscription) {
      console.log('Unsubscribing to the timer subscription', this.testSubscription);
      this.testSubscription.unsubscribe();
    }
  }
}

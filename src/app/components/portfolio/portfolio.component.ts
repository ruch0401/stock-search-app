import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {TickerService} from 'src/app/services/ticker.service';
import {Portfolio} from 'src/app/models/portfolio';
import {Alert} from "../../models/alert";
import {Router} from "@angular/router";
import {RepeatedService} from "../../services/repeated.service";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  // Variables - Reference to DOM elements
  @ViewChild('alertPortfolioTempRef') public alertPortfolioTempRef: ElementRef;

  // Variables - Alerts
  public portfolioAlert: Alert = {} as Alert;

  // variables for portfolio management
  public stockQuantity: number = 0;
  public walletBalance: number = parseFloat(localStorage.getItem('walletBalance') || '25000');
  public currentPrice: number;
  public isBuying: boolean;
  public tickerToSearch: string;
  public addedToPortfolio: boolean;
  public closeResult: string;
  public portfolioArr: Portfolio[] = [];
  public isPortfolioEmpty: boolean = true;
  public hasPortfolioTransactionOccurred: boolean;

  constructor(
    private modalService: NgbModal,
    private tickerService: TickerService,
    private router: Router,
    private repeatedService: RepeatedService,
    private decimalPipe: DecimalPipe) {
  }

  getLatestStockPrice(ticker: any) {
    this.repeatedService.getLatestStockPrice(ticker).subscribe((data) => {
      localStorage.setItem(ticker, JSON.stringify(data.c));
    })
  }

  ngOnInit(): void {
    this.getPortfolioViewData();
  }

  open(content: any, portfolio: Portfolio, isBuying: boolean) {
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

    // Whenever a transaction is about to happen, get the latest current price of the ticker in question; Set the buying
    // flag to true
    this.getLatestStockPrice(portfolio.ticker);
    this.isBuying = isBuying;

    const tickerElem = document.getElementById('custom-ticker');
    const currentPriceElem = document.getElementById('custom-current-price');
    const moneyInWalletElem = document.getElementById('custom-money-in-wallet');
    const totalElem = document.getElementById('custom-total');
    const quantity = document.getElementById('custom-quantity');
    this.currentPrice = parseFloat(localStorage.getItem(portfolio.ticker) || '-1');

    if (tickerElem && currentPriceElem && moneyInWalletElem && totalElem && quantity) {
      tickerElem.innerHTML = portfolio.ticker;
      currentPriceElem.innerHTML = `Current Price: ${this.currentPrice.toFixed(2)}`;
      moneyInWalletElem.innerHTML = `Money in Wallet: $${this.walletBalance.toFixed(2)}`;
    }

    // Also set the current ticker globally for future transactions
    this.tickerToSearch = portfolio.ticker;
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

  getPortfolioViewData() {
    let portfolioGroups = JSON.parse(localStorage.getItem('portfolio') || '[]');
    this.isPortfolioEmpty = portfolioGroups.length === 0;

    let portfolioViewArr: Portfolio[] = [];

    portfolioGroups.forEach((portfolio: any) => {
      this.getLatestStockPrice(portfolio.ticker)
      setTimeout(() => {
        let currPrice = JSON.parse(localStorage.getItem(portfolio.ticker) || '-1');
        let portfolioViewObject: Portfolio = {
          ticker: portfolio.ticker,
          tickerName: portfolio.tickerName,
          quantity: portfolio.quantity,
          totalCost: portfolio.totalCost,
          averageCostPerShare: parseFloat((portfolio.totalCost / portfolio.quantity).toFixed(2)),
          currentPrice: currPrice,
          change: parseFloat((currPrice - (portfolio.totalCost / portfolio.quantity)).toFixed(2)),
          marketValue: parseFloat((currPrice * portfolio.quantity).toFixed(2)),
        };
        portfolioViewArr.push(portfolioViewObject);
      }, 500);
    })
    this.portfolioArr = portfolioViewArr;
  }

  getStockQuantityForTicker(param: any): number {
    // Identify query ticker from `this` component instance
    let query = this.tickerToSearch;
    let portfolioGroups = JSON.parse(localStorage.getItem('portfolio') || '[]');
    let index = portfolioGroups.findIndex((o: { ticker: any; }) => o.ticker === query);
    return index === -1 ? 0 : portfolioGroups[index].quantity;
  }

  addToPortfolio(param: any) {
    // Identify query ticker from `this` component instance
    let query = this.tickerToSearch;

    // Whenever a transaction is about to happen, get the latest current price of the ticker in question; Set the buying flag to true
    // current price is always read from the localstorage
    this.getLatestStockPrice(this.tickerToSearch);

    // Create alert for successful buy of stock in portfolio
    this.portfolioAlert = new Alert('success', `${query} bought successfully.`, true, 5, true);
    this.alertPortfolioTempRef.nativeElement.style.display = 'block';
    this.addedToPortfolio = true;

    // Create buying transaction
    let quantity = parseInt((<HTMLInputElement>document.getElementById('custom-quantity'))?.value);
    let currentPrice = parseFloat(parseFloat(localStorage.getItem(this.tickerToSearch) || '-1').toFixed(2));
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
        tickerName: this.tickerToSearch,
        quantity: quantity,
        totalCost: quantity * currentPrice
      }
      portfolioGroups.push(transaction);
    } else {
      portfolioGroups[index].quantity += quantity;
      portfolioGroups[index].totalCost += quantity * currentPrice;
    }

    localStorage.setItem('portfolio', JSON.stringify(portfolioGroups)); // Add resulting portfolioGroup array to localstorage
    this.getPortfolioViewData(); // Reset portfolio
    this.modalService?.dismissAll(); // Close the modal programmatically
  }

  removeFromPortfolio(param: any) {
    // Identify query ticker from `this` component instance
    let query = this.tickerToSearch;

    // Create alert for successful sell of stock in portfolio
    this.portfolioAlert = new Alert('danger', `${query} sold successfully.`, true, 5, true);
    this.alertPortfolioTempRef.nativeElement.style.display = 'block';
    this.addedToPortfolio = false;

    // Create selling transaction
    let sellingQuantity = parseInt((<HTMLInputElement>document.getElementById('custom-quantity'))?.value);
    let sellingCurrentPrice = parseFloat(localStorage.getItem(this.tickerToSearch) || '-1');
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
      // this.addedToPortfolio = false;
    } else {
      portfolioGroups[index].quantity -= sellingQuantity;
      portfolioGroups[index].totalCost -= sellingQuantity * sellingCurrentPrice;
    }

    // Add resulting portfolioGroup array to localstorage
    localStorage.setItem('portfolio', JSON.stringify(portfolioGroups));

    // Reset portfolio
    this.getPortfolioViewData();

    // Close the modal programmatically
    this.modalService?.dismissAll();
  }

  removeAlertFromDom() {
    this.hasPortfolioTransactionOccurred = false;
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

  viewTicker(ticker: string) {
    this.router.navigateByUrl(`/search/${ticker}`);
  }
}

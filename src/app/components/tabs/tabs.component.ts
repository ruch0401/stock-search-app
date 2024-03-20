import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CompanyNews } from 'src/app/models/company-news';
import { Eps } from 'src/app/models/eps';
import { HistoricalData } from 'src/app/models/historical-data';
import { LatestStockPrice } from 'src/app/models/latest-stock-price';
import { Recommendation } from 'src/app/models/recommendation';
import { SocialSentiment } from 'src/app/models/social-sentiment';
import { TickerData } from 'src/app/models/ticker-data';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit, OnChanges {
  @Input('companyDetails') public companyDetails: TickerData;
  @Input('latestStockPrice') public latestStockPrice: LatestStockPrice;
  @Input('peers') public peers: string[];
  @Input('companyNews') public companyNews: CompanyNews[];
  @Input('socialSentiment') public socialSentiment: SocialSentiment;
  @Input('historicalData') public historicalData: HistoricalData;
  @Input('hourlyData') public hourlyData: HistoricalData;
  @Input('recommendationData') public recommendationData: Recommendation;
  @Input('eps') public epsData: Eps;

  public companyDataFromTabs: TickerData;
  public latestStockPriceFromTabs: LatestStockPrice;
  public peersFromTab: string[] = [];
  public companyNewsFromTabs: CompanyNews[] = [];
  public socialSentimentFromTabs: SocialSentiment;
  public historicalDataFromTabs: HistoricalData;
  public hourlyDataFromTabs: HistoricalData;
  public recommendationDataFromTabs: Recommendation;
  public epsFromTabs: Eps;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const companyDetailsDataChange = changes['companyDetails'];
    const latestStockPriceDataChange = changes['latestStockPrice'];
    const peersDataChange = changes['peers'];
    const companyNewsDataChange = changes['companyNews'];
    const socialSentimentDataChange = changes['socialSentiment'];
    const historicalDataChange = changes['historicalData'];
    const hourlyDataChange = changes['hourlyData'];
    const recommendationDataChange = changes['recommendationData'];
    const epsDataChange = changes['epsData'];

    if (companyDetailsDataChange) {
      this.companyDataFromTabs = this.companyDetails;
    }

    if (latestStockPriceDataChange) {
      this.latestStockPriceFromTabs = this.latestStockPrice;
    }

    if (peersDataChange) {
      this.peersFromTab = this.peers;
    }

    if (companyNewsDataChange) {
      this.companyNewsFromTabs = this.companyNews;
    }

    if (socialSentimentDataChange) {
      this.socialSentimentFromTabs = this.socialSentiment;
    }

    if (historicalDataChange) {
      this.historicalDataFromTabs = this.historicalData;
    }

    if (hourlyDataChange) {
      this.hourlyDataFromTabs = this.hourlyData;
    }

    if (recommendationDataChange) {
      this.recommendationDataFromTabs = this.recommendationData;
    }

    if (epsDataChange) {
      this.epsFromTabs = this.epsData;
    }
  }

  ngOnInit(): void {}
}

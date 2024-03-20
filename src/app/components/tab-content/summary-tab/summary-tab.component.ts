import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import * as Highcharts from 'highcharts';
import {BASE_URL} from 'src/app/models/baseurl';
import {HistoricalData} from 'src/app/models/historical-data';
import {LatestStockPrice} from 'src/app/models/latest-stock-price';
import {TickerData} from 'src/app/models/ticker-data';
import {SearchBoxComponent} from '../../search-box/search-box.component';
import 'moment-timezone';
import * as moment from 'moment';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.css'],
})
export class SummaryTabComponent implements OnInit, OnChanges {
  @Input('companyDetailsFromTabs') public companyDetails: TickerData;
  @Input('latestStockPriceFromTabs') public latestStockPrice: LatestStockPrice;
  @Input('peersFromTab') public peersFromTab: string[];
  @Input('hourlyDataFromTabs')
  public hourlyDataFromTabs: HistoricalData;

  public historicalData: HistoricalData = {} as HistoricalData;
  public hourlyData: HistoricalData = {} as HistoricalData;
  public highcharts: typeof Highcharts = Highcharts;
  public highchartOptions: Highcharts.Options;

  searchBoxComponent: SearchBoxComponent;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const hourlyDataChange = changes['hourlyDataFromTabs'];
    if (hourlyDataChange) {
      this.hourlyData = this.hourlyDataFromTabs;

      // Set and define highchart options
      this.highchartOptions = {
        title: {
          text: `${this.companyDetails.ticker} Hourly Price Variation`,
        },
        plotOptions: {
          series: {
            color: `${this.latestStockPrice.d < 0 ? '#d9534f' : '#5cb85c'}`,
          },
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          opposite: true,
          title: {
            text: '',
          },
        },
        series: [
          {
            showInLegend: false,
            lineWidth: 2,
            data: this.hourlyData.hourlyVariation,
            type: 'line',
            name: this.companyDetails.ticker,
            showInNavigator: true,
          },
        ],
        navigator: {
          series: {
            type: 'area',
            color: '#0000FF',
            fillOpacity: 1,
          },
        },
        tooltip: {
          split: true,
        },
        time: {
          getTimezoneOffset: this.getLATimezoneOffset
        }
      };
    }
  }

  ngOnInit(): void {}

  updateLatestSearchedTicker(peer: string) {
    console.log('Updating last searched stock');
    localStorage.setItem('lastSearchedStock', peer);
  }

  getLATimezoneOffset(timestamp: number) {
    let zone = 'America/Los_Angeles';
    return -moment.tz(timestamp, zone).utcOffset();
  }
}

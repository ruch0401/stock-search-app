import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HistoricalData } from 'src/app/models/historical-data';
import { TickerData } from 'src/app/models/ticker-data';

declare var require: any;
const Highcharts = require('highcharts/highstock');
require('highcharts/indicators/indicators')(Highcharts);
require('highcharts/indicators/volume-by-price')(Highcharts);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit, OnChanges {
  @Input('historicalDataFromTabs')
  public historicalDataFromTabs: HistoricalData;
  @Input('companyDetailsFromTabs') public companyDetailsFromTabs: TickerData;

  public historicalData: HistoricalData = {} as HistoricalData;
  public highcharts: any = Highcharts;
  public highchartOptions: Highcharts.Options;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const chartDataChange = changes['historicalDataFromTabs'];
    if (chartDataChange) {
      this.historicalData = this.historicalDataFromTabs;

      // Set and define highchart options
      this.highchartOptions = {
        rangeSelector: {
          enabled: true,
          selected: 2
        },

        title: {
          text: `${this.companyDetailsFromTabs.ticker} Historical`,
        },

        subtitle: {
          text: 'With SMA and Volume by Price technical indicators',
        },

        navigator: {
          enabled: true,
        },

        scrollbar: {
          enabled: true,
        },

        xAxis: {
          type: 'datetime',
          ordinal: true,
        },

        yAxis: [
          {
            startOnTick: false,
            endOnTick: false,
            labels: {
              align: 'right',
              x: -3,
            },
            title: {
              text: 'OHLC',
            },
            height: '60%',
            lineWidth: 2,
            resize: {
              enabled: true,
            },
            opposite: true,
          },
          {
            labels: {
              align: 'right',
              x: -3,
            },
            title: {
              text: 'Volume',
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2,
            opposite: true,
          },
        ],

        tooltip: {
          split: true,
        },

        plotOptions: {
          series: {
            dataGrouping: {
              units: [
                ['week', [1]],
                ['month', [1, 2, 3, 4, 6]],
              ],
            },
          },
        },

        legend: {
          enabled: false,
        },

        series: [
          {
            type: 'candlestick',
            name: `${this.companyDetailsFromTabs.ticker}`,
            id: 'aapl',
            zIndex: 2,
            data: this.historicalData.ohlc,
          },
          {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: this.historicalData.volume,
            yAxis: 1,
          },
          {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
              volumeSeriesID: 'volume',
            },
            dataLabels: {
              enabled: false,
            },
            zoneLines: {
              enabled: false,
            },
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
              enabled: false,
            },
          },
        ],
      };
    }
  }

  ngOnInit(): void {
    window.resizeTo(1920, 1080);
  }
}

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Recommendation} from "../../models/recommendation";
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-recommendation-chart',
  templateUrl: './recommendation-chart.component.html',
  styleUrls: ['./recommendation-chart.component.css']
})
export class RecommendationChartComponent implements OnInit, OnChanges {
  @Input('recommendationDataFromTabs') public recommendationDataFromTabs: Recommendation;

  public recommendationData: Recommendation = {} as Recommendation;

  // Highchart reference declaration for recommendation data
  public highchartsRecommendationData: typeof Highcharts = Highcharts;
  public highchartOptionsRecommendationData: Highcharts.Options;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const recommendationDataChanges = changes['recommendationDataFromTabs'];

    if (recommendationDataChanges) {
      this.recommendationData = this.recommendationDataFromTabs;

      this.highchartOptionsRecommendationData = {
        title: {
          text: 'Stacked column chart',
        },
        xAxis: {
          categories: this.recommendationData.period,
        },
        yAxis: {
          min: 0,
          title: {
            text: '#Analysis',
            align: "high"
          },
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: 'bold',
              color: '',
            },
          },
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: 'Strong Buy',
            type: 'column',
            data: this.recommendationData.strongBuy,
            color: '#1C6D37',
          },
          {
            name: 'Buy',
            type: 'column',
            data: this.recommendationData.buy,
            color: '#1EAE51',
          },
          {
            name: 'Hold',
            type: 'column',
            data: this.recommendationData.hold,
            color: '#A57B16',
          },
          {
            name: 'Sell',
            type: 'column',
            data: this.recommendationData.sell,
            color: '#CE4D50',
          },
          {
            name: 'Strong Sell',
            type: 'column',
            data: this.recommendationData.strongSell,
            color: '#652726',
          },
        ],
        credits: {
          enabled: false,
        },
      };
    }
  }

  ngOnInit(): void {
  }

}

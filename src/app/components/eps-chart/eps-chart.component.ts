import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from "highcharts";
import {Eps} from "../../models/eps";


@Component({
  selector: 'app-eps-chart',
  templateUrl: './eps-chart.component.html',
  styleUrls: ['./eps-chart.component.css']
})
export class EpsChartComponent implements OnInit, OnChanges {
  @Input('epsFromTabs') public epsDataFromTabs: Eps;

  public epsData: Eps = {} as Eps;

  // Highchart reference declaration for historical EPS data
  public highchartsEpsData: typeof Highcharts = Highcharts;
  public highchartOptionsEpsData: Highcharts.Options;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const epsDataChanges = changes['epsDataFromTabs'];
    if (epsDataChanges) {
      this.epsData = this.epsDataFromTabs;

      this.highchartOptionsEpsData = {
        title: {
          text: 'Historical EPS Surprises',
        },
        yAxis: {
          title: {
            text: 'Quarterly EPS',
          },
        },

        xAxis: {
          categories: this.epsData.period,
        },

        tooltip: {
          shared: true,
        },

        series: [
          {
            name: 'Actual',
            type: 'spline',
            data: this.epsData.actual,
          },
          {
            name: 'Estimate',
            type: 'spline',
            data: this.epsData.estimate,
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

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Eps } from 'src/app/models/eps';
import { Recommendation } from 'src/app/models/recommendation';
import { SocialSentiment } from 'src/app/models/social-sentiment';
import {TickerData} from "../../../models/ticker-data";

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
})
export class InsightsComponent implements OnInit, OnChanges {
  @Input('companyDetailsFromTabs') public companyDetails: TickerData;
  @Input('socialSentimentFromTabs') public socialSentiment: SocialSentiment;
  @Input('recommendationDataFromTabs') public recommendationDataFromTabs: Recommendation;
  @Input('epsFromTabs') public epsDataFromTabs: Eps;

  public recommendationData: Recommendation = {} as Recommendation;
  public epsData: Eps = {} as Eps;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const recommendationDataChanges = changes['recommendationDataFromTabs'];
    const epsDataChanges = changes['epsDataFromTabs'];

    if (recommendationDataChanges) {
      this.recommendationData = this.recommendationDataFromTabs;
    }

    if (epsDataChanges) {
      this.epsData = this.epsDataFromTabs;
    }
  }

  ngOnInit(): void {}
}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';

import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import {TickerService} from './services/ticker.service';
import {SearchBoxComponent} from './components/search-box/search-box.component';
import {TabsComponent} from './components/tabs/tabs.component';
import {SummaryTabComponent} from './components/tab-content/summary-tab/summary-tab.component';
import {TopNewsTabComponent} from './components/tab-content/top-news-tab/top-news-tab.component';
import {ChartsComponent} from './components/tab-content/charts/charts.component';
import {InsightsComponent} from './components/tab-content/insights/insights.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {DetailSummaryComponent} from './components/detail-summary/detail-summary.component';

import {DatePipe, DecimalPipe} from '@angular/common';
import {AlertComponent} from './components/alert/alert.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {InterceptorService} from "./services/interceptor.service";
import { RecommendationChartComponent } from './components/recommendation-chart/recommendation-chart.component';
import { EpsChartComponent } from './components/eps-chart/eps-chart.component';
import {RouteReuseStrategy} from "@angular/router";
import {CustomReuseStrategy} from "./common/reuse-strategy";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    routingComponents,
    SearchBoxComponent,
    TabsComponent,
    SummaryTabComponent,
    TopNewsTabComponent,
    ChartsComponent,
    InsightsComponent,
    AlertComponent,
    DetailSummaryComponent,
    RecommendationChartComponent,
    EpsChartComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        HttpClientModule,
        FormsModule,
        MatTabsModule,
        HighchartsChartModule,
        MatProgressSpinnerModule,
        MatInputModule,
    ],
  providers: [
    TickerService,
    DatePipe,
    DecimalPipe,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

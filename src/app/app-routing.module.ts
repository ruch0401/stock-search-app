import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { DetailSummaryComponent } from './components/detail-summary/detail-summary.component';

const routes: Routes = [
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  { path: 'search/home', redirectTo: '/search/home', pathMatch: 'full' },
  { path: 'search/:ticker', component: DetailSummaryComponent, pathMatch: 'full' },
  { path: 'watchlist', component: WatchlistComponent, pathMatch: 'full' },
  { path: 'portfolio', component: PortfolioComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [
  WatchlistComponent,
  PortfolioComponent,
  DetailSummaryComponent,
];

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public navbarCollapsed = true;
  public lastTickerSearched: string;
  public isCollapsed = true;

  constructor() {
  }

  ngOnInit(): void {
    this.lastTickerSearched = 'home';
  }

  getLastSearchedStockAndToggleNavbar() {
    this.lastTickerSearched = localStorage.getItem('lastSearchedStock') || 'home';
    this.isCollapsed = !this.isCollapsed;
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

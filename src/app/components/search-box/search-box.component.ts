import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap} from 'rxjs/operators';
import {RepeatedService} from "../../services/repeated.service";
import {EventService} from "../../services/event.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
})
export class SearchBoxComponent implements OnInit {
  @ViewChild('alert1') public alert1: ElementRef;

  public autocompleteTags: any = [];
  public ticker: string;
  public isLoading: boolean = false;
  formControl = new FormControl();

  // Variables - for validations
  public isTickerEntered: boolean = true;
  public alertRow: any;


  @Input("tickerSearched") public tickerSearched: string;

  constructor(
    private formBuilder: FormBuilder,
    private repeatedService: RepeatedService,
    private router?: Router,
    private eventService?: EventService,
  ) {
  }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(
      distinctUntilChanged(),
      filter(searchString => typeof searchString === 'string'),
      filter(searchString => searchString.length > 0),
      debounceTime(700),
      tap((term) => {
        if (term !== null || term !== '') {
          this.isLoading = true
        }
      }),
      switchMap((term: string) => {
        let termCapitalized = (term) ? term.toUpperCase() : term;
        if (termCapitalized === '' || termCapitalized === null) {
          return [];
        } else {
          return this.repeatedService.getTickerAutocompleteDetails(termCapitalized).pipe(finalize(() => this.isLoading = false));
        }
      })).subscribe({
      next: data => {
        this.autocompleteTags = data;
      },
      error: err => console.log(err)
    });
  }

  submit() {
    if (this.formControl.value) {
      this.router?.navigate(['/search', this.formControl.value]).catch(err => console.log(err));
    } else {
      this.isTickerEntered = false;
    }
  }

  resetInput() {
    this.isTickerEntered = true;
    this.eventService?.emit<object>({reset: this.isTickerEntered})
    this.formControl.reset();
    localStorage.setItem('lastSearchedStock', 'home');
    this.router?.navigate(['/search/home']).catch(err => console.log(err));

  }
}

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpBackend} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoaderService} from "./loader.service";
import {finalize} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  public totalRequests: number = 0;
  public completedRequests: number = 0;


  constructor(public loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Loader ON!');
    this.loaderService.isLoading.next(true);
    this.totalRequests++;
    return next.handle(req).pipe(finalize(() => {
      this.completedRequests++;
      console.log(`Completed ${this.completedRequests} / ${this.totalRequests} requests`);
      if (this.completedRequests === this.totalRequests) {
        console.log('Loader OFF!');
        this.loaderService.isLoading.next(false);
        this.completedRequests = 0;
        this.totalRequests = 0;
      }
    }));
  }
}

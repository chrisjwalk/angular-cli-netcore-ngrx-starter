
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  logDebug: boolean;
  constructor(private router: Router) {
    this.logDebug = !environment.production;
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    const authToken = '';

    // You could add auth tokens here to all HTTPClient requests if needed
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Pass on the cloned request instead of the original request.
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;

          if (this.logDebug) {
            console.log(`Request for ${req.method}: ${req.urlWithParams} ` +
              `took ${elapsed} ms ` +
              `with status ${event.status} - ${event.statusText}. ` +
              `Got data: `, event.body);
            if (req.method === 'PUT' || req.method === 'POST') {
              console.log(`Sent ${req.method} with body:`, req.body);
            }
          }
        }
      }),
      catchError((error, caught) => {
        console.log('Interceptor caught error', error, caught);
        return this.handleServiceError(error);
      })
    );

  }
  private handleServiceError = (error: Response | any) => {
    let errMsg: string;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403) {
        errMsg = '403 - Forbidden';
      } else if (error.status === 401) {
        errMsg = '401 - Unauthorized';
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return throwError(error);
  }
}

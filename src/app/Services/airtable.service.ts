import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
//import { iDynamicsPostUsers } from '../models/dynamics-post';

@Injectable({
  providedIn: 'root'
})
export class AirtableService {
  private apiUrl = 'https://api.airtable.com/v0/';
  protected apiKey: string;
  protected appId: string;

  constructor(private http: HttpClient) {
    this.http.get('assets/apiKey.txt', { responseType: 'text'}).subscribe(data => { this.apiKey = data });
    this.http.get('assets/appId.txt', { responseType: 'text'}).subscribe(data => { this.appId = data });
   }

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + this.apiKey});
  }

  get url(): string {
    return this.apiUrl + this.appId + '/';
  }

  getRequest(url: string): Observable<any> {
    const options = {
      method: 'GET',
      headers: this.headers,
      responseType: 'json' as const
    };

    return this.http.get(url, options).pipe(retry(2), catchError(this.handleError));
  }

  // postRequest(url: string): Observable<any> {
  //   const options = {
  //     method: 'POST',
  //     headers: this.headers,
  //     responseType: 'json' as const
  //   };

  //   return this.http.post<any>(url, options).pipe(retry(3), catchError(this.handleError));
  // }

  protected handleError(err): Observable<never> {
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}, body was: ${err.message}`;
    }

    return throwError(errorMessage);
  }
}

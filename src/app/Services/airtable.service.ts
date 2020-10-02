import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { retry, catchError, map, concatMap, filter, tap } from 'rxjs/operators';
//import { iDynamicsPostUsers } from '../models/dynamics-post';

@Injectable({
  providedIn: 'root'
})
export class AirtableService {
  private apiUrl = 'https://api.airtable.com/v0/';
  protected apiKey: string = 'keydd8XpkyCPuRrAA';
  protected appId: string = 'app4QIYQMEneJlvdK';
  protected unpaginatedOffset: string = '';

  constructor(private http: HttpClient) {
    // this.http.get('assets/apiKey.txt', { responseType: 'text'}).subscribe(data => { this.apiKey = data });
    // this.http.get('assets/appId.txt', { responseType: 'text'}).subscribe(data => { this.appId = data });

    // console.log("Key(" + this.apiKey + ")");  //debug
    // console.log("App ID(" + this.appId + ")");  //debug

    // console.log(this.http.get('assets/apiKey.txt', { responseType: 'text'})); //debug
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + this.apiKey });
  }

  get url(): string {
    return this.apiUrl + this.appId + '/';
  }

  getRequest(url: string): Observable<any> {
    return this.getPaginatedRequest(url, this.unpaginatedOffset)
      .pipe(
        concatMap(results => {
          if (results.offset) {
            // console.log('Offset(' + results.offset + ')'); //debug

            let resultsToMerge: Observable<any> = this.getPaginatedRequest(url, results.offset).pipe(map(data => data.records));
            let mergedResults = forkJoin([of(results.records), resultsToMerge]).pipe(map(([head, tail]) => {
              let results = { "records": [...head, ...tail] };
              return results;
            }));

            return mergedResults;

            // let joinedResults = forkJoin([of(results), resultsToJoin]);
            // let joinedResults = combineLatest([of(results), resultsToJoin]);
            // return joinedResults;
          }

          return of(results);
        })
        // , tap(data => console.log(JSON.stringify(data)))
        , filter(data => /*data.length > 0 &&*/ data.records !== null && data.records !== undefined && data.records.length > 0)
      );
  }
  // getRequest(url: string): Observable<any> {
  //   return this.getPaginatedRequest(url, this.unpaginatedOffset)
  //   .pipe(expand(data => {
  //     return data.offset ? this.getPaginatedRequest(url, data.offset) : of({})
  //   }).scan((acc, data) => {
  //     return [...acc, ...data.results]
  //   }, [])
  //   );
  // }

  getPaginatedRequest(url: string, offset: string): Observable<any> {
    const options = {
      method: 'GET',
      headers: this.headers,
      responseType: 'json' as const
    };

    if (offset.length === 0 || offset === this.unpaginatedOffset) {
      return this.http.get(url, options).pipe(retry(2), catchError(this.handleError));
    }

    let offsetUrl = 'offset=' + offset;

    let lastChar = url[url.length - 1];
    // console.log("Last Char(" + lastChar + ")"); //debug

    if (lastChar !== '?') {
      offsetUrl = '&' + offsetUrl;
    }

    // console.log('Offset Url(' + offsetUrl + ')'); //debug
    return this.http.get(url + offsetUrl, options).pipe(retry(2), catchError(this.handleError));
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

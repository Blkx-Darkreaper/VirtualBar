import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { retry, catchError, map, concatMap, filter, tap } from 'rxjs/operators';
//import { iDynamicsPostUsers } from '../models/dynamics-post';

@Injectable({
  providedIn: 'root'
})
export class AirtableService {
  private apiUrl = 'https://api.airtable.com/v0/';
  // protected apiKey: string;
  // protected appId: string;
  // protected apiKey: string = 'keydd8XpkyCPuRrAA';
  protected appId: string = 'app4QIYQMEneJlvdK';
  protected unpaginatedOffset: string = '';

  constructor(private http: HttpClient) {
    // this.http.get('assets/apiKey.txt', { responseType: 'text'}).subscribe(data => { this.apiKey = data });
    // this.http.get('assets/appId.txt', { responseType: 'text'}).subscribe(data => { this.appId = data });

    // this.getTextFromFile('assets/apiKey.txt').subscribe(data => { this.apiKey = data; 
    //   console.log("Key(" + this.apiKey + ")");  //debug
    // });
    // this.getTextFromFile('assets/appId.txt').subscribe(data => {this.appId = data;
    //   console.log("App ID(" + this.appId + ")");  //debug
    // });

    // this.getFileContents('assets/apiKey.txt')
    //   .subscribe((blob: Blob) => {
    //     const reader = new FileReader();
    //     reader.readAsText(blob);

    //     reader.onload = () => {
    //       this.apiKey = reader.result as string;
    //     };
    //   });

    //   this.getFileContents('assets/appId.txt')
    //   .subscribe((blob: Blob) => {
    //     const reader = new FileReader();
    //     reader.readAsText(blob);

    //     reader.onload = () => {
    //       this.appId = reader.result as string;
    //     };
    //   });

    // console.log(this.http.get('assets/apiKey.txt', { responseType: 'text'})); //debug
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + this.pat });
  }

  get url(): string {
    return this.apiUrl + this.appId + '/';
  }

  get pat(): string {
    return this.GetFileContents('../assets/perAccessTok.txt');
  }

  GetFileContents(filepath: string): string {
    const fs = require('node:fs');

    try {
      const data = fs.readFileSync(filepath, 'utf8');
      console.log(data);

      return data;
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  // getRequest(url: string): Observable<any> {
  //   return this.getPaginatedObservable(url, this.unpaginatedOffset)
  //     .pipe(
  //       concatMap(results => {
  //         // TODO need to make this a while or recursive so it will merge all results while results have an offset
  //         if (results.offset) {
  //           // console.log('Offset(' + results.offset + ')'); //debug

  //           let resultsToMerge: Observable<any> = this.getPaginatedObservable(url, results.offset).pipe(map(data => data.records));
  //           let mergedResults = forkJoin([of(results.records), resultsToMerge]).pipe(map(([head, tail]) => {
  //             let results = { "records": [...head, ...tail] };
  //             return results;
  //           }));

  //           return mergedResults;

  //           // let joinedResults = forkJoin([of(results), resultsToJoin]);
  //           // let joinedResults = combineLatest([of(results), resultsToJoin]);
  //           // return joinedResults;
  //         }

  //         return of(results);
  //       })
  //       // , tap(data => console.log(JSON.stringify(data)))
  //       , filter(data => /*data.length > 0 &&*/ data.records !== null && data.records !== undefined && data.records.length > 0)
  //     );
  // }
  // getRequest(url: string): Observable<any> {
  //   return this.getPaginatedRequest(url, this.unpaginatedOffset)
  //   .pipe(expand(data => {
  //     return data.offset ? this.getPaginatedRequest(url, data.offset) : of({})
  //   }).scan((acc, data) => {
  //     return [...acc, ...data.results]
  //   }, [])
  //   );
  // }

  getRequest(url: string, offset: string = this.unpaginatedOffset): Observable<any> {
    // console.log('getRequest("' + url + '", "' + offset + '")'); //debug

    // return of();  //testing

    return this.getPaginatedObservable(url, offset)
      .pipe(
        concatMap(results => {
          if (results.offset) {
            // console.log('Offset(' + results.offset + ')'); //debug

            return this.getRequest(url, results.offset)
              .pipe(
                // tap(response => console.log('Results to Merge: ' + JSON.stringify(response))),
                map(resultsToMerge => [...results.records, ...resultsToMerge.records])
              );
          }

          return of(results.records);
        })
        , map(results => { return { "records": results}; })
        // , tap(response => console.log('Results to Filter: ' +JSON.stringify(response)))
        , filter(results => results.records !== null && results.records !== undefined && results.records.length > 0)
      );
  }

  getPaginatedObservable(url: string, offset: string): Observable<any> {
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

//   getTextFromFile(filename): Observable<string> {
//     let text = '';

//     this.http.get(filename, { responseType: 'blob', observe: 'response' })
//   .subscribe((value: HttpResponse<Blob>) => {
//     const data = new Blob([value.body as Blob], {type: value.body?.type});
//     const reader = new FileReader();
//     reader.readAsText(data);

//     reader.onload = (content) => {
//       const textInFile = reader.result as string;
//       // console.log("File Text(" + textInFile + ")");  //debug

//       text = textInFile;
//     };
//   });

//   console.log("Text(" + text + ")");  //debug

//   return of(text);
//   }
// }

// public getFileContents(filename: string): Observable<Blob> {
//   return this.http.get('assets/faq.txt', { responseType: 'blob', observe: 'response' })
//       .pipe((value:  HttpResponse<Blob>) => {
//         return new Blob([value.body as Blob], {type: value.body?.type});
//       });
//   }
}
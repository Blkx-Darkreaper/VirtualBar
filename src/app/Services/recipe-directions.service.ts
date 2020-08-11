import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeDirectionsService extends AirtableService {
  requestUrl: string = 'Recipe%20Directions?filterByFormula={Recipe%20ID}=';

  constructor(http: HttpClient) { super(http) }

  GetDirectionsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + recipeId;
    return this.getRequest(url);
  }
}
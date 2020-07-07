import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeDirectionsService extends AirtableService {
  requestUrl: string = 'Recipe%20Directions?filterByFormula={Recipe ID}=';

  constructor(http: HttpClient) { super(http) }

  /*GetDirections(recipeName: string): string[] {
    let allDirections = [];

    switch(recipeName) {
      case '20th Century Cocktail':
        allDirections = ["Add ice, lemon juice, creme de cacao, lillet blanc, and gin to shaker and mix thoroughly", 
        "Strain into chilled nick and nora glass", "Garnish with twist of lemon"];;
        break;

      case 'Ahumado Seco':
        break;

      case 'Appletini':
        break;
    }

      return allDirections;
  }*/

  GetDirections(recipeId: number): Observable<any> {
    let allDirections = {"directions": []};

    switch(recipeId) {
      case 1:
        allDirections = {"directions": ["Add ice, lemon juice, creme de cacao, lillet blanc, and gin to shaker and mix thoroughly", 
        "Strain into chilled nick and nora glass", "Garnish with twist of lemon"]};
        break;

      case 2:
        break;

      case 6:
        break;
    }

      return of(allDirections);
  }

  GetDirectionsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + recipeId;
    return this.getRequest(url);
  }
}
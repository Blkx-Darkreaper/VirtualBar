import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientsService extends AirtableService {
  requestUrl: string = 'Recipe%20Ingredients?filterByFormula={Recipe ID}=';

  constructor(http: HttpClient) { super(http) }

  /*GetIngredients(recipeName: string): string[] {
    let allIngredients = [];
    
    switch(recipeName) {
      case '20th Century Cocktail':
        allIngredients = ["¾ oz / 22 ½ mL Lemon juice", "½ oz / 15 mL Crème de Cacao", "¾ oz / 22 ½ mL Lillet blanc", 
        "1 ½ oz / 45 mL London Dry Gin", "Lemon twist"];
        break;

      case 'Ahumado Seco':
        break;

      case 'Appletini':
        break;
    }
    
    return allIngredients;
  }*/

  GetIngredients(recipeId: number): Observable<any> {
    let allIngredients = {"ingredients": []};
    
    switch(recipeId) {
      case 1:
        allIngredients = {"ingredients": ["¾ oz / 22 ½ mL Lemon juice", "½ oz / 15 mL Crème de Cacao", "¾ oz / 22 ½ mL Lillet blanc", 
        "1 ½ oz / 45 mL London Dry Gin", "Lemon twist"]};
        break;

      case 2:
        break;

      case 6:
        break;
    }
    
    return of(allIngredients);
  }

  GetIngredientsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + recipeId;
    return this.getRequest(url);
  }
}
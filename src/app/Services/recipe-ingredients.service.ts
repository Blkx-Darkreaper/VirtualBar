import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientsService extends AirtableService {
  recipeIngredientUrl: string = 'Recipe%20Ingredients?filterByFormula={Recipe%20ID}='
  fieldFilter: string = '&fields[]=Ingredient Name&fields[]=Order&fields[]=Ounces&fields[]=Millilitres&fields[]=Quantity'
    + '&fields[]=Grams&fields[]=Dashes&fields[]=Barspoons&fields[]=Teaspoons&fields[]=Cups';

    ingredientUrl: string = 'Ingredients?filterByFormula={Name}=';

    liquorUrl: string = "Liquors?filterByFormula=Search('";
    liquorUrlSuffix: string = "',{Ingredient%20Type})";

  constructor(http: HttpClient) { super(http) }

  GetIngredientsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.recipeIngredientUrl + recipeId;
    return this.getRequest(url);
  }

  GetIngredientTypeFromAirtable(ingredientName: string): Observable<any> {
    let url = this.url as string;
    url += this.ingredientUrl + ingredientName;
    return this.getRequest(url);
  }

  GetLiquorFromAirtable(type: string): Observable<any> {
    let url = this.url as string;
    url += this.liquorUrl + type + this.liquorUrlSuffix;
    return this.getRequest(url);
  }
}
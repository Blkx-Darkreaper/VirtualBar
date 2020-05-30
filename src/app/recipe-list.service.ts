import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {

    constructor() { }

/*     GetRecipes(): RecipeModel[] {
      const allRecipes = [
        {name: '20th Century Cocktail', variant: ''}, 
        {name: 'Ahumado Seco', variant: ''}, 
        {name: 'Appletini', variant: ''}
      ];

      return allRecipes;
    } */

    GetRecipes(types: string[], styles: string[], families: string[], 
      primaryComponents: string[], secondaryComponents: string[], limitToAvailable: boolean
      ): Observable<any> {
      const allRecipes = {"recipes":[
        {name: '20th Century Cocktail', variant: ''}, 
        {name: 'Ahumado Seco', variant: ''}, 
        {name: 'Appletini', variant: ''}
      ]};

      return of(allRecipes);
    }
}
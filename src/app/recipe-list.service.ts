import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { RecipeIdentity } from './recipe-identity';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {

    constructor() { }

/*     GetRecipes(): RecipeIdentity[] {
      const allRecipes = [
        {name: '20th Century Cocktail', variant: ''}, 
        {name: 'Ahumado Seco', variant: ''}, 
        {name: 'Appletini', variant: ''}
      ];

      return allRecipes;
    } */

    GetRecipeNames(): Observable<any> {
      const allRecipes = {"recipes":[
        {name: '20th Century Cocktail', variant: ''}, 
        {name: 'Ahumado Seco', variant: ''}, 
        {name: 'Appletini', variant: ''}
      ]};

      return of(allRecipes);
    }
}
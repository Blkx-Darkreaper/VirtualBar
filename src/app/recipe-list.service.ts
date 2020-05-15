import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {

    constructor() { }

    GetAllRecipes(): Observable<any> {
      const allRecipes = {"names": ["20th Century Cocktail", "Ahumado Seco", "Appletini"]};
      return of(allRecipes);
    }
}
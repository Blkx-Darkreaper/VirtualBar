import { RecipeModel } from '../recipe-model';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientsService {

  constructor() { }

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

  GetIngredients(recipe: RecipeModel): Observable<any> {
    let allIngredients = {"ingredients": []};
    
    switch(recipe.fields.name) {
      case '20th Century Cocktail':
        allIngredients = {"ingredients": ["¾ oz / 22 ½ mL Lemon juice", "½ oz / 15 mL Crème de Cacao", "¾ oz / 22 ½ mL Lillet blanc", 
        "1 ½ oz / 45 mL London Dry Gin", "Lemon twist"]};
        break;

      case 'Ahumado Seco':
        break;

      case 'Appletini':
        break;
    }
    
    return of(allIngredients);
  }
}
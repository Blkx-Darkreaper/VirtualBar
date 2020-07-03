import { RecipeModel } from '../recipe-model';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeDirectionsService {

  constructor() { }

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

  GetDirections(recipe: RecipeModel): Observable<any> {
    let allDirections = {"directions": []};

    switch(recipe.fields.name) {
      case '20th Century Cocktail':
        allDirections = {"directions": ["Add ice, lemon juice, creme de cacao, lillet blanc, and gin to shaker and mix thoroughly", 
        "Strain into chilled nick and nora glass", "Garnish with twist of lemon"]};
        break;

      case 'Ahumado Seco':
        break;

      case 'Appletini':
        break;
    }

      return of(allDirections);
  }
}
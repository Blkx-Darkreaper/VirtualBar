import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientsService {

  constructor() { }

  GetIngredients() {
    return ["¾ oz / 22 ½ mL Lemon juice", "½ oz / 15 mL Crème de Cacao", "¾ oz / 22 ½ mL Lillet blanc", 
    "1 ½ oz / 45 mL London Dry Gin", "Lemon twist"];
  }
}

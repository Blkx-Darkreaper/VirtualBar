import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeComponentsService {
  constructor() { }

  GetPrimaries() {
    return ["Vodka", "Gin", "Tequila", "Rum", "Liqueur"];
  }

  GetSecondaries() {
    return ["Liqueur", "Wine", "Mixer", "Juice"];
  }
}

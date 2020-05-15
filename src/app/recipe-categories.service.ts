import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeCategoriesService {
  constructor() { }

  GetTypes() {
    return ["Shot", "Cocktail"];
  }

  GetStyles() {
    return ["Blended", "Built in Glass", "Layered", "Shaken", "Stirred"]
  }

  GetFamilies() {
    return ["Cocktail", "Duo", "Flip", "Highball", "Hot Toddy"];
  }
}

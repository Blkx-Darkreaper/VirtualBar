import { Inventory } from './inventory.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IngredientInventoriesService {
  GetInventories() {
    let home = new Inventory();
    home.name = "Home";

    let allInventories = new Array();
    allInventories.push(home);

    return allInventories;
  }

  constructor() { }
}

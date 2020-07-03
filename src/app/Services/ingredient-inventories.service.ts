import { of, Observable } from 'rxjs';
import { Inventory } from '../inventory.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IngredientInventoriesService {
  GetInventories(): Observable<any> {
    let home = new Inventory();
    home.name = "Home";

    let other = new Inventory();
    other.name = "Other";

    const allInventories = {"inventories": JSON.stringify([home, other])};
      return of(allInventories);
  }

  constructor() { }
}

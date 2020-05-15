import { Observable } from 'rxjs';
import { Inventory } from './inventory.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IngredientInventoriesService {
  GetInventories(): Observable<any> {
    let home = new Inventory();
    home.name = "Home";

    const allInventories = {"inventories": [JSON.stringify(home)]};
      return of(allInventories);
  }

  constructor() { }
}

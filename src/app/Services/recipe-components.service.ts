import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeComponentsService {
  constructor() { }

  GetPrimaries(): Observable<any> {
    const allComponents = {"components": ["Vodka", "Gin", "Tequila", "Rum", "Liqueur"]};
      return of(allComponents);
  }

  GetSecondaries(): Observable<any> {
    const allComponents = {"components": ["Liqueur", "Wine", "Mixer", "Juice"]};
      return of(allComponents);
  }
}

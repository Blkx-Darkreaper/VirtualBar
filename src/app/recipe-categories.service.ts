import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeCategoriesService {
  constructor() { }

  GetTypes(): Observable<any> {
    const allTypes = {"types": ["Shot", "Cocktail"]};
      return of(allTypes);
  }

  GetStyles(): Observable<any> {
    const allStyles = {"styles": ["Blended", "Built in Glass", "Layered", "Shaken", "Stirred"]};
      return of(allStyles);
  }

  GetFamilies(): Observable<any> {
    const allFamilies = {"families": ["Cocktail", "Duo", "Flip", "Highball", "Hot Toddy"]};
      return of(allFamilies);
  }
}

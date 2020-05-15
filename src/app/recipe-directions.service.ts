import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeDirectionsService {

  constructor() { }

  GetDirections(): Observable<any> {
    const allDirections = {"directions": ["Add ice, lemon juice, creme de cacao, lillet blanc, and gin to shaker and mix thoroughly", 
    "Strain into chilled nick and nora glass", "Garnish with twist of lemon"]};
      return of(allDirections);
  }
}

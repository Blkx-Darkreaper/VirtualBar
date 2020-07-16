import { AirtableService } from './airtable.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeComponentsService extends AirtableService {
  requestUrl: string = 'Ingredients';
  primaryFilter: string = '?filterByFormula=And({Type}="Spirit",{Qualifier}=Blank())';
  // secondaryFilter: string = '?filterByFormula=And({Supertype}="Liquor",{Qualifier}=Blank())';
  secondaryFilter: string = '?filterByFormula={Supertype}="Liquor"';

  constructor(http: HttpClient) { super(http) }

  GetPrimaries(): Observable<any> {
    const allComponents = {"components": ["Vodka", "Gin", "Tequila", "Rum", "Liqueur"]};
      return of(allComponents);
  }

  GetPrimariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + this.primaryFilter;
    return this.getRequest(url);
  }

  GetSecondaries(): Observable<any> {
    const allComponents = {"components": ["Liqueur", "Wine", "Mixer", "Juice"]};
      return of(allComponents);
  }

  GetSecondariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + this.secondaryFilter;
    return this.getRequest(url);
  }
}

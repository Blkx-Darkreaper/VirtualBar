import { AirtableService } from './airtable.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeComponentsService extends AirtableService {
  ingTypeRequestUrl: string = 'Ingredient%20Types';
  fieldPrefix: string = '?fields[]=';
  nameField: string = 'Name';
  filterByFormula: string = '&filterByFormula='
  primaryFilter: string = 'And({Type}="Spirit",Len({Subtype})>0,Len({Category})=0)';
  // secondaryFilter: string = '?filterByFormula=And({Supertype}="Liquor",{Qualifier}=Blank())';
  // secondaryFilter: string = '?filterByFormula={Supertype}="Liquor"';
  secondaryFilter: string = 'And({Supertype}="Liquor",{Type}!="Spirit",Len({Subtype})>0,Len({Category})=0)';
  
  ingRequestUrl: string = 'Ingredients';
  tertiaryFilter: string = '{Supertype}!="Liquor"';

  constructor(http: HttpClient) { super(http) }

  GetPrimariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.ingTypeRequestUrl + this.fieldPrefix + this.nameField + this.filterByFormula + this.primaryFilter;
    return this.getRequest(url);
  }

  GetSecondariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.ingTypeRequestUrl + this.fieldPrefix + this.nameField + this.filterByFormula + this.secondaryFilter;
    return this.getRequest(url);
  }

  /* GetTertiariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.ingRequestUrl + this.fieldsFilter + this.tertiaryFilter;
    return this.getRequest(url);
  } */

  GetIngredientTypesFromAirtable(fieldName: string): Observable<any> {
    let url = this.url as string;
    url += this.ingRequestUrl + this.fieldPrefix + fieldName;
    return this.getRequest(url);
  }
}

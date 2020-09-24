import { AirtableService } from './airtable.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeComponentsService extends AirtableService {
  requestUrl: string = 'Ingredient%20Types';
  fieldsFilter: string = '?fields[]=Name';
  primaryFilter: string = '&filterByFormula=And({Type}="Spirit",Len({Subtype})>0)';
  // secondaryFilter: string = '?filterByFormula=And({Supertype}="Liquor",{Qualifier}=Blank())';
  // secondaryFilter: string = '?filterByFormula={Supertype}="Liquor"';
  secondaryFilter: string = '&filterByFormula=And({Supertype}="Liquor",{Type}!="Spirit",Len({Subtype})>0)';

  constructor(http: HttpClient) { super(http) }

  GetPrimariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + this.fieldsFilter + this.primaryFilter;
    return this.getRequest(url);
  }

  GetSecondariesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + this.fieldsFilter + this.secondaryFilter;
    return this.getRequest(url);
  }
}

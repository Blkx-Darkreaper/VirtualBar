import { AirtableService } from './airtable.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeCategoriesService extends AirtableService {
  typesRequestUrl: string = 'Types';
  occassionsRequestUrl: string = 'Occassions';
  stylesRequestUrl: string = 'Prep%20Styles';
  familiesRequestUrl: string = 'Cocktail%20Family';
  superFamilyFilter: string = '?filterByFormula={Superfamily}=BLANK()';

  constructor(http: HttpClient) { super(http) }

  GetTypes(): Observable<any> {
    const allTypes = {"types": ["Shot", "Cocktail"]};
      return of(allTypes);
  }

  GetTypesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.typesRequestUrl;
    return this.getRequest(url);
  }

  GetOccassionsFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.occassionsRequestUrl;
    return this.getRequest(url);
  }

  GetStyles(): Observable<any> {
    const allStyles = {"styles": ["Blended", "Built in Glass", "Layered", "Shaken", "Stirred"]};
      return of(allStyles);
  }

  GetStylesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.stylesRequestUrl;
    return this.getRequest(url);
  }

  GetFamilies(): Observable<any> {
    const allFamilies = {"families": ["Cocktail", "Duo", "Flip", "Highball", "Hot Toddy"]};
      return of(allFamilies);
  }

  GetFamiliesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.familiesRequestUrl + this.superFamilyFilter;
    return this.getRequest(url);
  }
}

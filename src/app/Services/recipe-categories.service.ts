import { AirtableService } from './airtable.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeCategoriesService extends AirtableService {
  typesRequestUrl: string = 'Types?';
  occassionsRequestUrl: string = 'Occassions?';
  stylesRequestUrl: string = 'Prep%20Styles?';

  nameField: string = 'fields[]=Name';

  familiesRequestUrl: string = 'Cocktail%20Family?';
  notesField: string = '&fields[]=Notes';
  superFamilyFilter: string = '&filterByFormula={Superfamily}=BLANK()';

  constructor(http: HttpClient) { super(http) }

  GetTypesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.typesRequestUrl + this.nameField;
    return this.getRequest(url);
  }

  GetOccassionsFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.occassionsRequestUrl + this.nameField;
    return this.getRequest(url);
  }

  GetStylesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.stylesRequestUrl + this.nameField;
    return this.getRequest(url);
  }

  GetFamiliesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.familiesRequestUrl + this.nameField + this.superFamilyFilter;
    return this.getRequest(url);
  }

  // GetTypes(): Observable<any> {
  //   const allTypes = {"types": ["Shot", "Cocktail"]};
  //     return of(allTypes);
  // }

  // GetStyles(): Observable<any> {
  //   const allStyles = {"styles": ["Blended", "Built in Glass", "Layered", "Shaken", "Stirred"]};
  //     return of(allStyles);
  // }

  // GetFamilies(): Observable<any> {
  //   const allFamilies = {"families": ["Cocktail", "Duo", "Flip", "Highball", "Hot Toddy"]};
  //     return of(allFamilies);
  // }
}
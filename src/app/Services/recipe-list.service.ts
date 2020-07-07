import { AirtableService } from './airtable.service';
import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService extends AirtableService {
  requestUrl: string = 'Recipe%20Names?fields[]=Recipe ID&fields[]=Name&fields[]=Variant';

    constructor(http: HttpClient) { super(http) }

    GetRecipes(allTypes: string[], allStyles: string[], allFamilies: string[], 
      allPrimaryComponents: string[], allSecondaryComponents: string[], limitToAvailable: boolean
      ): Observable<any> {
      const allRecipes = {"records":[
        {id: 'recwlMsjYThiXto6x', fields: {id: 1, name: '20th Century Cocktail'}, createdTime: '2020-04-16T16:37:28.000Z'}, 
        {id: 'recZpZn7bWbxauSmP', fields: {id: 2, name: 'Ahumado Seco'}, createdTime: '2020-04-16T18:17:00.000Z'}, 
        {id: 'recK7mTjXbgoIPryN', fields: {id: 6, name: 'Appletini', variant: 'Sour apple schnapps'}, createdTime: '2020-04-17T02:53:04.000Z'}
      ]};

      return of(allRecipes);
    }

     GetRecipesFromAirtable(allTypes: string[], allStyles: string[], allFamilies: string[], 
    allPrimaryComponents: string[], allSecondaryComponents: string[], limitToAvailable: boolean
    ): Observable<any> {
      let url = this.url as string;
      url += this.requestUrl;

      let totalFilters = 0;
      let typeFilter :string = "", styleFilter: string = "", familyFilter: string = "", 
      primaryFilter: string = "", secondaryFilter: string = "";

      if(allTypes.length > 1 || allTypes[0].toLowerCase() != "all") {
        totalFilters++;
        typeFilter = this.AppendFieldFilters(typeFilter, "Type", allTypes);
      }

      if(allStyles.length > 1 || allStyles[0].toLowerCase() != "all") {
        totalFilters++;
        styleFilter = this.AppendFieldFilters(styleFilter, "Prep Style", allStyles);
      }

      if(allFamilies.length > 1 || allFamilies[0].toLowerCase() != "all") {
        totalFilters++;
        familyFilter = this.AppendFieldFilters(familyFilter, "Family", allFamilies);
      }

      if(allPrimaryComponents.length > 1 || allPrimaryComponents[0].toLowerCase() != "all") {
        totalFilters++;
        primaryFilter = this.AppendFieldFilters(primaryFilter, "Primary Components", allPrimaryComponents);
      }

      if(allSecondaryComponents.length > 1 || allSecondaryComponents[0].toLowerCase() != "all") {
        totalFilters++;
        secondaryFilter = this.AppendFieldFilters(secondaryFilter, "Secondary Components", allSecondaryComponents);
      }

      if(totalFilters > 0) {
        let filterByFormula = "";

        // Add filters
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, typeFilter);
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, styleFilter);
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, familyFilter);
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, primaryFilter);
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, secondaryFilter);

        if(totalFilters > 1) {
          filterByFormula = "And(" + filterByFormula + ")";
        }

        url += "&filterByFormula=" + filterByFormula;
      }

      return this.getRequest(url);
    }

    private AppendToFilterByFormula(superFilter: string, subFilter: string): string {
      if(subFilter.length == 0) {
        return superFilter;
      }

        if(superFilter.length > 0) {
          superFilter += ",";
        }

        superFilter += subFilter;
        return superFilter;
    }

    private AppendFieldFilters(filter: string, fieldName: string, allFieldValues: string[]): string {
      // Add filters
      for(let i in allFieldValues) {
        let fieldValue = allFieldValues[i];

        if(filter.length > 0) {
          filter += ",";
        }

        filter += "{" + fieldName + "}='" + fieldValue + "'";
      }

      if(allFieldValues.length > 1) {
        filter = "Or(" + filter + ")";
      }

      return filter;
    }
}
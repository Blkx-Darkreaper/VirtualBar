import { AirtableService } from './airtable.service';
import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService extends AirtableService {
  requestUrl: string = 'Recipe%20Names?';

  recipeIdField: string = 'fields[]=Recipe ID';
  nameField: string = '&fields[]=Name';
  variantField: string = '&fields[]=Variant';
  versionField: string = '&fields[]=Version';
  typeField: string = '&fields[]=Type Name';

  constructor(http: HttpClient) { super(http) }

  GetRecipesFromAirtable(allTypes: string[], allOccassions: string[], allStyles: string[], allFamilies: string[],
    muddlingRequired: boolean, allPrimaryComponents: string[], allSecondaryComponents: string[], recipeNameToFind: string
  ): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    // Add field filters
    url += this.recipeIdField;
    url += this.nameField;
    url += this.variantField;
    url += this.versionField;
    url += this.typeField;

    // console.log("Types(" + allTypes + ")"); //debug
    // console.log("Occassions(" + allOccassions + ")"); //debug
    // console.log("Styles(" + allStyles + ")"); //debug
    // console.log("Families(" + allFamilies + ")"); //debug
    // console.log("Primary(" + allPrimaryComponents + ")"); //debug
    // console.log("Secondary(" + allSecondaryComponents + ")"); //debug

    let totalFilters = 0;
    let typeFilter: string = "", occassionsFilter: string = "", styleFilter: string = "", familyFilter: string = "",
      muddlingFilter: string = "", primaryFilter: string = "", secondaryFilter: string = "", nameFilter: string = "";

    if (allTypes.length > 1 || allTypes[0].toLowerCase() != "all") {
      totalFilters++;
      typeFilter = this.AppendExactFieldFilters(typeFilter, "Type", allTypes);
    }

    if (allOccassions.length > 1 || allOccassions[0].toLowerCase() != "all") {
      totalFilters++;
      occassionsFilter = this.AppendExactFieldFilters(occassionsFilter, "Occassions", allOccassions);
    }

    if (allStyles.length > 1 || allStyles[0].toLowerCase() != "all") {
      totalFilters++;
      styleFilter = this.AppendExactFieldFilters(styleFilter, "Prep Style", allStyles);
    }

    if (allFamilies.length > 1 || allFamilies[0].toLowerCase() != "all") {
      totalFilters++;
      familyFilter = this.AppendExactFieldFilters(familyFilter, "Family", allFamilies);
    }

    if (muddlingRequired === true) {
      totalFilters++;
      muddlingFilter = "{Muddled}";
    }

    if (allPrimaryComponents.length > 1 || allPrimaryComponents[0].toLowerCase() != "all") {
      totalFilters++;
      primaryFilter = this.AppendExactFieldFilters(primaryFilter, "Primary Components", allPrimaryComponents);
    }

    if (allSecondaryComponents.length > 1 || allSecondaryComponents[0].toLowerCase() != "all") {
      totalFilters++;
      secondaryFilter = this.AppendContainsFieldFilters(secondaryFilter, "Secondary Components", allSecondaryComponents);
    }

    if (recipeNameToFind.length > 0) {
      totalFilters++;
      nameFilter = "SEARCH('" + recipeNameToFind.toLowerCase() + "',LOWER({Name}))";
    }

    if (totalFilters > 0) {
      let filterByFormula = "";

      // Add filters
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, typeFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, occassionsFilter)
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, styleFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, familyFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, muddlingFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, primaryFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, secondaryFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, nameFilter);

      if (totalFilters > 1) {
        filterByFormula = "And(" + filterByFormula + ")";
      }

      url += "&filterByFormula=" + filterByFormula;
    }

    // console.log('GetRecipes Url(' + url + ')');  //debug

    return this.getRequest(url);
  }

  private AppendToFilterByFormula(superFilter: string, subFilter: string): string {
    if (subFilter.length == 0) {
      return superFilter;
    }

    if (superFilter.length > 0) {
      superFilter += ",";
    }

    superFilter += subFilter;
    return superFilter;
  }

  private AppendExactFieldFilters(filter: string, fieldName: string, allFieldValues: string[]): string {
    // Add filters
    for (let i in allFieldValues) {
      let fieldValue = allFieldValues[i];

      if (filter.length > 0) {
        filter += ",";
      }

      filter += "{" + fieldName + "}='" + fieldValue + "'";
    }

    if (allFieldValues.length > 1) {
      filter = "Or(" + filter + ")";
    }

    return filter;
  }

  private AppendContainsFieldFilters(filter: string, fieldName: string, allFieldValues: string[]): string {
    // Add filters
    for (let i in allFieldValues) {
      let fieldValue = allFieldValues[i];

      if (filter.length > 0) {
        filter += ",";
      }

      // Can't find first element in list unless array is converted to string
      filter += "Find('" + fieldValue + "',ArrayJoin({" + fieldName + "}, ','))";
    }

    if (allFieldValues.length > 1) {
      filter = "Or(" + filter + ")";
    }

    return filter;
  }
}
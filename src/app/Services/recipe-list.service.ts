import { AirtableService } from './airtable.service';
import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { tap } from 'rxjs/operators';

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

  GetRecipesFromAirtable(allTypes: string[], allOccasions: string[], allStyles: string[], allFamilies: string[],
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
    // console.log("Occasions(" + allOccasions + ")"); //debug
    // console.log("Styles(" + allStyles + ")"); //debug
    // console.log("Families(" + allFamilies + ")"); //debug
    // console.log("Primary(" + allPrimaryComponents + ")"); //debug
    // console.log("Secondary(" + allSecondaryComponents + ")"); //debug

    let totalFilters = 0;
    let typeFilter: string = "", occasionsFilter: string = "", styleFilter: string = "", familyFilter: string = "",
      muddlingFilter: string = "", primaryFilter: string = "", secondaryFilter: string = "", nameFilter: string = "";

    if (allTypes.length > 1 || allTypes[0].toLowerCase() != "all") {
      totalFilters++;
      typeFilter = this.AppendContainsFieldFilters(typeFilter, "Type", allTypes);
      // console.log("Type Filter Formula(" + typeFilter + ")"); //debug
    }

    if (allOccasions.length > 1 || allOccasions[0].toLowerCase() != "all") {
      totalFilters++;
      occasionsFilter = this.AppendContainsFieldFilters(occasionsFilter, "Occasions", allOccasions);
    }

    if (allStyles.length > 1 || allStyles[0].toLowerCase() != "all") {
      totalFilters++;
      styleFilter = this.AppendContainsFieldFilters(styleFilter, "Prep Style", allStyles);
    }

    if (allFamilies.length > 1 || allFamilies[0].toLowerCase() != "all") {
      totalFilters++;
      familyFilter = this.AppendExactFieldFilters(familyFilter, "Family", allFamilies);
    }

    if (muddlingRequired === true) {
      totalFilters++;
      muddlingFilter = "{Muddled}";
    }

    if (allPrimaryComponents.length > 0 && allPrimaryComponents[0].toLowerCase() != "all") {
      totalFilters++;
      primaryFilter = this.AppendContainsFieldFilters(primaryFilter, "Primary Components", allPrimaryComponents);
      secondaryFilter = this.AppendContainsFieldFilters(secondaryFilter, "Secondary Components", allPrimaryComponents);
    }

    if (allSecondaryComponents.length > 0 && allSecondaryComponents[0].toLowerCase() != "all") {
      totalFilters++;
      primaryFilter = this.AppendContainsFieldFilters(primaryFilter, "Primary Components", allSecondaryComponents);
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
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, occasionsFilter)
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, styleFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, familyFilter);
      filterByFormula = this.AppendToFilterByFormula(filterByFormula, muddlingFilter);
      
      // console.log("Filter with components Formula(" + filterByFormula + ")"); //debug

      // console.log("Primary(" + primaryFilter + "), Secondary(" + secondaryFilter + ")");  //debug

      let componentFilter = "";
      if(primaryFilter.length > 0 && secondaryFilter.length > 0) {
        componentFilter += "Or(" + primaryFilter + "," + secondaryFilter + ")";
      } else {
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, primaryFilter);
        filterByFormula = this.AppendToFilterByFormula(filterByFormula, secondaryFilter);
      }

      // console.log("Component(" + componentFilter + ")");  //debug

      filterByFormula = this.AppendToFilterByFormula(filterByFormula, componentFilter);

      filterByFormula = this.AppendToFilterByFormula(filterByFormula, nameFilter);

      if (totalFilters > 1) {
        filterByFormula = "And(" + filterByFormula + ")";
        // filterByFormula = "Or(" + filterByFormula + ")";
      }

      // console.log("Filter Formula(" + filterByFormula + ")"); //debug

      url += "&filterByFormula=" + filterByFormula;
    }

    // console.log('GetRecipes Url(' + url + ')');  //debug

    return this.getRequest(url);
    // .pipe(tap(response => console.log('Recipe List Response(' + JSON.stringify(response) + ')')));
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
      filter += 'Find("' + fieldValue + '",ArrayJoin({' + fieldName + '}, ","))';
    }

    if (allFieldValues.length > 1) {
      filter = "Or(" + filter + ")";
    }

    return filter;
  }
}
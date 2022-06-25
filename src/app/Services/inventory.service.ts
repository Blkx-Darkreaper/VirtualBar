import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AirtableService } from './airtable.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends AirtableService {
  inventoryUrl: string = 'Inventory?';
  simpleInventoryUrl: string = 'Simple%20Inventory?';
  usersUrl: string = 'Users?';

  addrField: string = 'fields[]=Address';
  volumeField: string = 'fields[]=Current Volume (mL)';

  userIdField: string = 'fields[]=ID';
  nameField: string = 'fields[]=Name';
  brandField: string = 'fields[]=Brand';
  descField: string = 'fields[]=Description';
  typeField: string = 'fields[]=Type';
  subTypeField: string = 'fields[]=Subtype';
  ingredientTypeField: string = 'fields[]=Ingredient Type Name';
  ingredientNamesField: string = 'fields[]=Ingredient Names';

  brandFilter: string = '{Brand}=';
  descFilter: string = '{Description}=';
  userFilter: string = '{User ID}=';
  typeFilter: string = '{Type}';
  addrFilter: string = '{Address}=';

  activeUsersFilter: string = "filterByFormula={Status}='Active'"

  filterPrefix: string = 'filterByFormula=And(';
  filterIngredientNamesPrefix = 'Or('
  filterFindPrefix: string = 'FIND(';
  filterFindSuffix: string = '{Ingredient Types})';
  statusFilter: string = '{Available}=True()';

  constructor(http: HttpClient) { super(http); }

  GetInventoriesFromAirtable(): Observable<any> {
    // let url = this.url as string;
    // url += this.inventoryUrl + this.addrField;
    // return this.getRequest(url);

    let url = this.url as string;
    url += this.usersUrl + this.userIdField;

    url += '&' + this.activeUsersFilter;

    return this.getRequest(url);
    
//     return of(JSON.parse('{"records": [{"id": "rec3yTiBoVOawVAK8","fields": {"Address": "4021 Century Rd"},\
// "createdTime": "2020-04-17T01:03:56.000Z"}]}'));  //testing
  }

  GetLiquorTypesFromAirtable(userId: number): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;

    url += '&' + this.filterPrefix + this.userFilter + "'" + userId + "')";

    return this.getRequest(url);
  }

  GetSpiritLiquorTypesFromAirtable(userId: number): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.nameField;
    url += '&' + this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;
    url += '&' + this.ingredientNamesField;

    url += '&' + this.filterPrefix + this.userFilter + "'" + userId + "'";
    url += ',' + this.typeFilter + "='Spirit'";
    url += ',' + this.statusFilter + ')';

    // console.log('GetSpiritLiquorTypes(' + url + ')');  //debug

    return this.getRequest(url);
  }

  GetNonSpiritLiquorTypesFromAirtable(userId: number): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.nameField;
    url += '&' + this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;
    url += '&' + this.ingredientNamesField;

    url += '&' + this.filterPrefix + this.userFilter + "'" + userId + "'";
    url += ',' + this.typeFilter + "!='Spirit'";
    url += ',' + this.statusFilter + ')';

    // console.log('GetNonSpiritLiquorTypes(' + url + ')');  //debug

    return this.getRequest(url);
  }

  GetLiquorIngredientNamesFromAirtable(userId: number): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.nameField;
    url += '&' + this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;
    url += '&' + this.ingredientNamesField;

    url += '&' + this.filterPrefix + this.userFilter + "'" + userId + "'";
    url += ',' + this.statusFilter + ')';

    // console.log('GetLiquorIngredientNames(' + url + ')');  //debug

    return this.getRequest(url);
  }

  GetLiquorVolumeFromAirtable(brand: string, desc: string, address: string): Observable<any> {
    let url = this.url as string;
    url += this.inventoryUrl;

    url += this.brandFilter + brand;
    url += this.descFilter + desc;
    url += this.userFilter + address;

    url += this.volumeField;

    return this.getRequest(url);
  }

  GetAllIngredientQuantitiesFromAirtable(address: string, allIngredientNames: string[]): Observable<any> {
    let url = this.url as string;

    url += this.brandField;
    url += '&' + this.descField;
    url += '&' + this.userIdField;
    url += '&' + this.volumeField;

    url += '&' + this.filterPrefix + this.userFilter + "'" + address;

    let filterUrl = '';
    for(let i in allIngredientNames) {
      let ingredientName = allIngredientNames[i];

      if(filterUrl.length > 0) {
        filterUrl += ',';
      }

      url += this.filterFindPrefix + "'" + ingredientName + "'," + this.filterFindSuffix;
    }

    if(filterUrl.length > 0) {
      url += "'," + this.filterIngredientNamesPrefix + filterUrl + ')';
    }

    url += ')';

    console.log('GetAllIngredientQuantities(' + url + ')');  //debug

    return this.getRequest(url);
  }

  GetIngredientQuantitiesFromAirtable(address: string, ingredientName: string): Observable<any> {
    let url = this.url as string;

    url += this.brandField;
    url += '&' + this.descField;
    // url += '&' + this.addrField;
    url += '&' + this.volumeField;

    url += '&' + this.filterPrefix + this.userFilter + "'" + address;
    url += "'," + this.filterFindPrefix + "'" + ingredientName + "'" + this.filterFindSuffix
    url += ')';

    console.log('GetIngredientQuantities(' + url + ')');  //debug

    return this.getRequest(url);
  }
}
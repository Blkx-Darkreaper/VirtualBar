import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AirtableService } from './airtable.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends AirtableService {
  inventoryUrl: string = 'Inventory?';
  simpleInventoryUrl: string = 'Simple%20Inventory?';

  addrField: string = 'fields[]=Address';
  brandField: string = 'fields[]=Brand';
  descField: string = 'fields[]=Description';
  volumeField: string = 'fields[]=Current Volume (mL)';
  typeField: string = 'fields[]=Type';
  subTypeField: string = 'fields[]=Subtype';
  ingredientTypeField: string = 'fields[]=Ingredient Type Name';

  brandFilter: string = '{Brand}=';
  idescFilter: string = '{Description}=';
  addrFilter: string = '{Address}=';
  typeFilter: string = '{Type}';

  filterPrefix: string = 'filterByFormula=And(';
  filterIngredientNamesPrefix = 'Or('
  filterFindPrefix: string = 'FIND(';
  filterFindSuffix: string = '{Ingredient Types})';
  statusFilter: string = '{Available}=True()'

  constructor(http: HttpClient) { super(http); }

  GetInventoriesFromAirtable(): Observable<any> {
    let url = this.url as string;
    url += this.inventoryUrl + this.addrField;
    return this.getRequest(url);
  }

  GetLiquorTypesFromAirtable(address: string): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;

    url += '&' + this.filterPrefix + this.addrFilter + "'" + address + "')";

    return this.getRequest(url);
  }

  GetSpiritLiquorTypesFromAirtable(address: string): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;

    url += '&' + this.filterPrefix + this.addrFilter + "'" + address + "'";
    url += ',' + this.typeFilter + "='Spirit'";
    url += ',' + this.statusFilter + ')';

    return this.getRequest(url);
  }

  GetNonSpiritLiquorTypesFromAirtable(address: string): Observable<any> {
    let url = this.url as string;
    url += this.simpleInventoryUrl;

    url += this.brandField;
    url += '&' + this.descField;
    url += '&' + this.typeField;
    url += '&' + this.subTypeField;
    url += '&' + this.ingredientTypeField;

    url += '&' + this.filterPrefix + this.addrFilter + "'" + address + "'";
    url += ',' + this.typeFilter + "!='Spirit'";
    url += ',' + this.statusFilter + ')';

    return this.getRequest(url);
  }

  GetLiquorVolumeFromAirtable(brand: string, desc: string, address: string): Observable<any> {
    let url = this.url as string;
    url += this.inventoryUrl;

    url += this.brandFilter + brand;
    url += this.idescFilter + desc;
    url += this.addrFilter + address;

    url += this.volumeField;

    return this.getRequest(url);
  }

  GetAllIngredientQuantitiesFromAirtable(address: string, allIngredientNames: string[]): Observable<any> {
    let url = this.url as string;

    url += this.brandField;
    url += '&' + this.descField;
    url += '&' + this.addrField;
    url += '&' + this.volumeField;

    url += '&' + this.filterPrefix + this.addrFilter + "'" + address;

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

    url += '&' + this.filterPrefix + this.addrFilter + "'" + address;
    url += "'," + this.filterFindPrefix + "'" + ingredientName + "'" + this.filterFindSuffix
    url += ')';

    console.log('GetIngredientQuantities(' + url + ')');  //debug

    return this.getRequest(url);
  }
}
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AirtableService } from './airtable.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeInfoService extends AirtableService {
  requestUrl: string = 'Recipe%20Names?';
  nameField: string = 'fields[]=Name';
  variantField: string = 'fields[]=Variant';
  attachmentField: string = 'fields[]=Attachments';
  recipeFilter: string = 'filterByFormula={Recipe%20ID}=';

  constructor(http: HttpClient) { super(http) }

  GetRecipeImagesFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl

    url += this.nameField;
    url += '&' + this.variantField;
    url += '&' + this.attachmentField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }
}
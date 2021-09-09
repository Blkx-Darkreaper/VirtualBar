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
  occasionsField: string = 'fields[]=Occasion%20Names';
  prepStylesField: string = 'fields[]=Prep%20Style%20Names';
  servedField: string = 'fields[]=Served%20Names';
  glassField: string = 'fields[]=Glass%20Names';
  cocktailFamilyField: string = 'fields[]=Family%20Names';
  relatedToField: string = 'fields[]=Related%20to';
  ouncesField: string = 'fields[]=Total%20Volume%20(oz)';
  millilitresField: string = 'fields[]=Total%20Volume%20(mL)';
  notesField: string = 'fields[]=Notes';
  // Field: string = 'fields[]=';
  attachmentField: string = 'fields[]=Attachments';
  recipeFilter: string = 'filterByFormula={Recipe%20ID}=';

  constructor(http: HttpClient) { super(http) }

  GetPrepStylesFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.prepStylesField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetGlassFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.glassField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetServedFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.servedField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetCocktailFamiliesFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.cocktailFamilyField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetOccasionsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.occasionsField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetRelatedToFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.relatedToField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetOuncesFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.ouncesField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetMillilitresFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.millilitresField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetNotesFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.notesField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }

  GetRecipeImagesFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl;

    url += this.nameField;
    url += '&' + this.variantField;
    url += '&' + this.attachmentField;

    url += '&' + this.recipeFilter + recipeId;
    return this.getRequest(url);
  }
}
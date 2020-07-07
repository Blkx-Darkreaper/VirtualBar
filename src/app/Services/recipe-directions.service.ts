import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeDirectionsService extends AirtableService {
  requestUrl: string = 'Recipe%20Directions?filterByFormula={Recipe ID}=';

  constructor(http: HttpClient) { super(http) }

  /*GetDirections(recipeName: string): string[] {
    let allDirections = [];

    switch(recipeName) {
      case '20th Century Cocktail':
        allDirections = ["Add ice, lemon juice, creme de cacao, lillet blanc, and gin to shaker and mix thoroughly", 
        "Strain into chilled nick and nora glass", "Garnish with twist of lemon"];;
        break;

      case 'Ahumado Seco':
        break;

      case 'Appletini':
        break;
    }

      return allDirections;
  }*/

  GetDirections(recipeId: number): Observable<any> {
    let allDirections = {"records": []};

    switch(recipeId) {
      case 1:
        allDirections = {
          "records": [
              {
                  "id": "recAdXztHCgky2aFm",
                  "fields": {
                      "Recipe Direction ID": 3,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Step": 3,
                      "Direction": "Garnish with twist of lemon"
                  },
                  "createdTime": "2020-04-16T17:56:05.000Z"
              },
              {
                  "id": "recUzXp2KGoeMYpoz",
                  "fields": {
                      "Recipe Direction ID": 1,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Step": 1,
                      "Direction": "Add ice, lemon juice, creme de cacao, lillet blanc, and gin to shaker and mix thoroughly"
                  },
                  "createdTime": "2020-04-16T17:56:05.000Z"
              },
              {
                  "id": "recyUoBvZsDXTpgge",
                  "fields": {
                      "Recipe Direction ID": 2,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Step": 2,
                      "Direction": "Strain into chilled nick and nora glass"
                  },
                  "createdTime": "2020-04-16T17:56:05.000Z"
              }
          ]
      };
        break;

      case 2:
        allDirections = {
          "records": [
              {
                  "id": "recB5z28uK0NAIofz",
                  "fields": {
                      "Recipe Direction ID": 6,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Step": 3,
                      "Direction": "Garnish with orange peel"
                  },
                  "createdTime": "2020-04-16T18:21:56.000Z"
              },
              {
                  "id": "recas8KPBMn6Y02S7",
                  "fields": {
                      "Recipe Direction ID": 5,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Step": 2,
                      "Direction": "Add ice to double rocks glass and strain in mixture"
                  },
                  "createdTime": "2020-04-16T18:21:54.000Z"
              },
              {
                  "id": "recyvHxxvI3rzazH0",
                  "fields": {
                      "Recipe Direction ID": 4,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Step": 1,
                      "Direction": "Add crushed ice, mezkal, ginger liqueur, and agua fresca to shaker. Mix thoroughly"
                  },
                  "createdTime": "2020-04-16T18:21:47.000Z"
              }
          ]
      }
        break;

      case 6:
        allDirections = {
          "records": [
              {
                  "id": "recOrVIyA6kBFyWfs",
                  "fields": {
                      "Recipe Direction ID": 19,
                      "Recipe ID": [
                          "recuc3BU3F9wzzQGe"
                      ],
                      "Step": 1,
                      "Direction": "Add ice, vodka, schnapps, and lemon juice to shaker. Mix thoroughly"
                  },
                  "createdTime": "2020-04-16T19:37:31.000Z"
              }
          ]
      }
        break;
    }

      return of(allDirections);
  }

  GetDirectionsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + recipeId;
    return this.getRequest(url);
  }
}
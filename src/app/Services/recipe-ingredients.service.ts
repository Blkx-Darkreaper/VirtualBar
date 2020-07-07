import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientsService extends AirtableService {
  requestUrl: string = 'Recipe%20Ingredients?filterByFormula={Recipe ID}=';

  constructor(http: HttpClient) { super(http) }

  /*GetIngredients(recipeName: string): string[] {
    let allIngredients = [];
    
    switch(recipeName) {
      case '20th Century Cocktail':
        allIngredients = ["¾ oz / 22 ½ mL Lemon juice", "½ oz / 15 mL Crème de Cacao", "¾ oz / 22 ½ mL Lillet blanc", 
        "1 ½ oz / 45 mL London Dry Gin", "Lemon twist"];
        break;

      case 'Ahumado Seco':
        break;

      case 'Appletini':
        break;
    }
    
    return allIngredients;
  }*/

  GetIngredients(recipeId: number): Observable<any> {
    let allIngredients = {"records": []};
    
    switch(recipeId) {
      case 1:
        allIngredients = {
          "records": [
              {
                  "id": "recBhlYOFCQQFIuoA",
                  "fields": {
                      "Recipe Ingredient ID": 5,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Ingredient Name": [
                          "recb6D3EACfR5l79b"
                      ],
                      "Order": 5,
                      "Ingredient Type": [
                          "Garnish"
                      ]
                  },
                  "createdTime": "2020-04-16T18:13:57.000Z"
              },
              {
                  "id": "recVwNFepg7xBNRbw",
                  "fields": {
                      "Recipe Ingredient ID": 4,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Ounces": 1.5,
                      "Millilitres": 45,
                      "Ingredient Name": [
                          "recY007FNDqkWKhMi"
                      ],
                      "Order": 1,
                      "Ingredient Type": [
                          "Spirit"
                      ],
                      "Ingredient Supertype": [
                          "Liquor"
                      ]
                  },
                  "createdTime": "2020-04-16T18:09:24.000Z"
              },
              {
                  "id": "receuHNIpNjnyt9FC",
                  "fields": {
                      "Recipe Ingredient ID": 2,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Ounces": 0.5,
                      "Millilitres": 15,
                      "Ingredient Name": [
                          "recUNIMdCFZS8R8Yw"
                      ],
                      "Order": 3,
                      "Ingredient Type": [
                          "Liqueur"
                      ],
                      "Ingredient Supertype": [
                          "Liquor"
                      ]
                  },
                  "createdTime": "2020-04-16T17:55:47.000Z"
              },
              {
                  "id": "reciB4lgFK1EptGZe",
                  "fields": {
                      "Recipe Ingredient ID": 1,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Ounces": 0.8,
                      "Millilitres": 22.5,
                      "Ingredient Name": [
                          "recS2s9pI3CUhS0LU"
                      ],
                      "Order": 4,
                      "Ingredient Type": [
                          "Juice"
                      ]
                  },
                  "createdTime": "2020-04-16T17:55:47.000Z"
              },
              {
                  "id": "recnP2sdTqA4Ei9Qc",
                  "fields": {
                      "Recipe Ingredient ID": 3,
                      "Recipe ID": [
                          "recwlMsjYThiXto6x"
                      ],
                      "Ounces": 0.75,
                      "Millilitres": 22.5,
                      "Ingredient Name": [
                          "rec676s3VXPY2DRYI"
                      ],
                      "Order": 2,
                      "Ingredient Type": [
                          "Wine"
                      ],
                      "Ingredient Supertype": [
                          "Liquor"
                      ]
                  },
                  "createdTime": "2020-04-16T17:55:47.000Z"
              }
          ]
      };
        break;

      case 2:
        allIngredients = {
          "records": [
              {
                  "id": "recEQaAQjugUDKAmQ",
                  "fields": {
                      "Recipe Ingredient ID": 7,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Ounces": 0.75,
                      "Millilitres": 22.5,
                      "Ingredient Name": [
                          "recH80pEawPq2LNs8"
                      ],
                      "Order": 2,
                      "Ingredient Type": [
                          "Liqueur"
                      ],
                      "Ingredient Supertype": [
                          "Liquor"
                      ]
                  },
                  "createdTime": "2020-04-16T18:20:13.000Z"
              },
              {
                  "id": "recJS3cs6miFOLbBj",
                  "fields": {
                      "Recipe Ingredient ID": 8,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Ounces": 2.5,
                      "Millilitres": 75,
                      "Ingredient Name": [
                          "rec3BORebOryMPymD"
                      ],
                      "Order": 3,
                      "Ingredient Type": [
                          "Mixer"
                      ]
                  },
                  "createdTime": "2020-04-16T18:20:50.000Z"
              },
              {
                  "id": "recLieREKEouI4maf",
                  "fields": {
                      "Recipe Ingredient ID": 9,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Ingredient Name": [
                          "rectG8vbyx6ezUGvF"
                      ],
                      "Order": 4,
                      "Ingredient Type": [
                          "Garnish"
                      ]
                  },
                  "createdTime": "2020-04-16T18:22:17.000Z"
              },
              {
                  "id": "recY6VYkWsoV58GVm",
                  "fields": {
                      "Recipe Ingredient ID": 6,
                      "Recipe ID": [
                          "recZpZn7bWbxauSmP"
                      ],
                      "Ounces": 1.5,
                      "Millilitres": 45,
                      "Ingredient Name": [
                          "reckYnaVx3sIqb04W"
                      ],
                      "Order": 1,
                      "Ingredient Type": [
                          "Spirit"
                      ],
                      "Ingredient Supertype": [
                          "Liquor"
                      ]
                  },
                  "createdTime": "2020-04-16T18:18:56.000Z"
              }
          ]
      }
        break;

      case 6:
        break;
    }
    
    return of(allIngredients);
  }

  GetIngredientsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + recipeId;
    return this.getRequest(url);
  }
}
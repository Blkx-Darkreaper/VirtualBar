import { AirtableService } from './airtable.service';
//import { RecipeModel } from '../recipe';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientsService extends AirtableService {
  requestUrl: string = 'Recipe%20Ingredients?filterByFormula=FIND('
  requestUrlSuffix: string = ', {Recipe ID})';
  fieldFilter: string = '&fields[]=Ingredient Name&fields[]=Order&fields[]=Ounces&fields[]=Millilitres&fields[]=Quantity'
    + '&fields[]=Grams&fields[]=Dashes&fields[]=Barspoons&fields[]=Teaspoons&fields[]=Cups';

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
                        "Ingredient": [
                            "recb6D3EACfR5l79b"
                        ],
                        "Order": 5,
                        "Ingredient Type": [
                            "Garnish"
                        ],
                        "Ingredient Name": [
                            "Lemon twist"
                        ],
                        "Quantity": 1
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
                        "Ingredient": [
                            "recY007FNDqkWKhMi"
                        ],
                        "Order": 1,
                        "Ingredient Type": [
                            "Spirit"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "London dry Gin"
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
                        "Ingredient": [
                            "recUNIMdCFZS8R8Yw"
                        ],
                        "Order": 3,
                        "Ingredient Type": [
                            "Liqueur"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "Crème de Cacao"
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
                        "Ingredient": [
                            "recS2s9pI3CUhS0LU"
                        ],
                        "Order": 4,
                        "Ingredient Type": [
                            "Juice"
                        ],
                        "Ingredient Name": [
                            "Lemon juice"
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
                        "Ingredient": [
                            "rec676s3VXPY2DRYI"
                        ],
                        "Order": 2,
                        "Ingredient Type": [
                            "Wine"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "Lillet blanc"
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
                        "Ingredient": [
                            "recH80pEawPq2LNs8"
                        ],
                        "Order": 2,
                        "Ingredient Type": [
                            "Liqueur"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "Ginger liqueur"
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
                        "Ingredient": [
                            "rec3BORebOryMPymD"
                        ],
                        "Order": 3,
                        "Ingredient Type": [
                            "Mixer"
                        ],
                        "Ingredient Name": [
                            "Hibiscus agua fresca"
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
                        "Ingredient": [
                            "rectG8vbyx6ezUGvF"
                        ],
                        "Order": 4,
                        "Ingredient Type": [
                            "Garnish"
                        ],
                        "Ingredient Name": [
                            "Orange peel"
                        ],
                        "Quantity": 1
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
                        "Ingredient": [
                            "reckYnaVx3sIqb04W"
                        ],
                        "Order": 1,
                        "Ingredient Type": [
                            "Spirit"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "Mezcal"
                        ]
                    },
                    "createdTime": "2020-04-16T18:18:56.000Z"
                }
            ]
        };
        break;

      case 6:
          allIngredients = {
            "records": [
                {
                    "id": "recGwfA9GanqC1pJm",
                    "fields": {
                        "Recipe Ingredient ID": 26,
                        "Recipe ID": [
                            "recuc3BU3F9wzzQGe",
                            "recK7mTjXbgoIPryN"
                        ],
                        "Ounces": 1,
                        "Millilitres": 30,
                        "Ingredient": [
                            "recX5QcygODNULT2C"
                        ],
                        "Order": 2,
                        "Ingredient Type": [
                            "Liqueur"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "Green apple schnapps"
                        ]
                    },
                    "createdTime": "2020-04-16T19:34:08.000Z"
                },
                {
                    "id": "recLo3FVyY5MsqR7o",
                    "fields": {
                        "Recipe Ingredient ID": 27,
                        "Recipe ID": [
                            "recuc3BU3F9wzzQGe",
                            "recOWoWdVO4u4AQH5",
                            "recK7mTjXbgoIPryN"
                        ],
                        "Ounces": 0.25,
                        "Millilitres": 7.5,
                        "Ingredient": [
                            "recS2s9pI3CUhS0LU"
                        ],
                        "Teaspoons": 1.5,
                        "Order": 3,
                        "Ingredient Type": [
                            "Juice"
                        ],
                        "Ingredient Name": [
                            "Lemon juice"
                        ]
                    },
                    "createdTime": "2020-04-16T19:34:46.000Z"
                },
                {
                    "id": "rectfmwQyFjDKynIs",
                    "fields": {
                        "Recipe Ingredient ID": 28,
                        "Recipe ID": [
                            "recuc3BU3F9wzzQGe",
                            "recOWoWdVO4u4AQH5",
                            "recK7mTjXbgoIPryN"
                        ],
                        "Ingredient": [
                            "recfyYgifkQDsw1Tz"
                        ],
                        "Order": 4,
                        "Ingredient Type": [
                            "Garnish"
                        ],
                        "Ingredient Name": [
                            "Apple slice"
                        ]
                    },
                    "createdTime": "2020-04-16T19:37:03.000Z"
                },
                {
                    "id": "recxv0Fhry8XX8e3k",
                    "fields": {
                        "Recipe Ingredient ID": 25,
                        "Recipe ID": [
                            "recuc3BU3F9wzzQGe",
                            "recOWoWdVO4u4AQH5",
                            "recVpxbLaLZYZwipm",
                            "recK7mTjXbgoIPryN"
                        ],
                        "Ounces": 1.5,
                        "Millilitres": 45,
                        "Ingredient": [
                            "recKtbFc6eCbONByA"
                        ],
                        "Order": 1,
                        "Ingredient Type": [
                            "Spirit"
                        ],
                        "Ingredient Supertype": [
                            "Liquor"
                        ],
                        "Ingredient Name": [
                            "Vodka"
                        ]
                    },
                    "createdTime": "2020-04-16T19:33:23.000Z"
                }
            ]
        };
        break;
    }
    
    return of(allIngredients);
  }

  GetIngredientsFromAirtable(recipeId: number): Observable<any> {
    let url = this.url as string;
    url += this.requestUrl + recipeId + this.requestUrlSuffix;
    return this.getRequest(url);
  }
}
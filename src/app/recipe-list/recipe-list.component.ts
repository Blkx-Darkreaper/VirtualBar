import { InventoryService } from './../Services/inventory.service';
import { LiquorModel } from './../Models/liquor-model';
import { IngredientTypeModel } from '../Models/ingredient-type-model';
import { RecipeModel } from './../Models/recipe-model';
import { RecipeIngredientModel } from '../Models/recipe-ingredient-model';
import { RecipeListService } from '../Services/recipe-list.service';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { map, filter, concatMap, switchMap, tap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.sass']
})
export class RecipeListComponent implements OnInit, OnChanges {
  title = "Recipes";
  allRecipes: RecipeModel[];
  selectedRecipe: RecipeModel;

  currentRecipePage: Array<RecipeModel>;
  // page = 1;

  allFields: [string, string][] = [["Cups", "cup"], ["Ounces", "oz"], ["Millilitres", "mL"], ["Quantity", ""], 
  ["Grams", "g"], ["Dashes", ""], ["Barspoons (tsp)", "barspoons/tsp"], ["Misc", ""]];

  @Input('types') allDrinkTypes: string[] = ['all'];
  @Input('occasions') allDrinkOccasions: string[] = ['all'];
  @Input('styles') allPreparationStyles: string[] = ['all'];
  @Input('families') allFamilies: string[] = ['all'];
  @Input('muddling') muddlingRequired: boolean = false;
  @Input('primaries') allPrimaryComponents: string[] = ['all'];
  @Input('secondaries') allSecondaryComponents: string[] = ['all'];
  @Input('name') recipeNameToFind: string = '';
  @Input('inventory') inventoryAddr: string = '';
  @Input('user') userId: number = -1;
  @Input('limit') limitToAvailable: boolean = false;
  @Input('liquors') allAvailableLiquorIngredients = {};
  @Input('spirits') allAvailableSpirits: { [type: string]: LiquorModel[]; } = {};
  @Input('nonspirits') allAvailableNonSpirits: { [type: string]: LiquorModel[]; } = {};

  constructor(private recipeListService: RecipeListService,
    private ingredientService: RecipeIngredientsService,
    private directionService: RecipeDirectionsService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.allRecipes = [];

    // console.log("Drink Types(" + this.allDrinkTypes + ")"); //debug

    // this.updateRecipeList();
  }

  ngOnChanges(): void {
    // console.log("Changes to recipe list");  //debug

    // console.log("Drink Types(" + this.allDrinkTypes + ")"); //debug

    // console.log("Limit(" + this.limitToAvailable + "), User ID(" + this.userId + "), Liquors("
    //  + this.allAvailableLiquors + ")"); //debug

    // console.log("List Spirits(" + Object.keys(this.allAvailableSpirits) + ")");  //debug
    // console.log("List Non-Spirits(" + Object.keys(this.allAvailableNonSpirits) + ")");  //debug

    /* if (this.limitToAvailable === true && this.inventoryAddr.length > 0
      && Object.keys(this.allAvailableSpirits).length > 0 && Object.keys(this.allAvailableNonSpirits).length > 0) {
      this.updateLimitedRecipeList();
      return;
    } */

    this.updateRecipeList();
  }

  updateRecipeList(): void {
    // console.log("updateRecipeList"); //debug

    this.allRecipes = [];

    // console.log("Types(" + this.allDrinkTypes + ")"); //debug
    // console.log("Occasions(" + this.allDrinkOccasions + ")"); //debug
    // console.log("Styles(" + this.allPreparationStyles + ")"); //debug
    // console.log("Families(" + this.allFamilies + ")"); //debug
    // console.log("Primary(" + this.allPrimaryComponents + ")"); //debug
    // console.log("Secondary(" + this.allSecondaryComponents + ")"); //debug

    if (!this.allDrinkTypes ||this.allDrinkTypes.length == 0
      || !this.allDrinkOccasions || this.allDrinkOccasions.length == 0
      || !this.allPreparationStyles || this.allPreparationStyles.length == 0
      || !this.allFamilies || this.allFamilies.length == 0
      || ((!this.allPrimaryComponents || this.allPrimaryComponents.length == 0) 
      && (!this.allSecondaryComponents || this.allSecondaryComponents.length == 0))
      ) {
      this.allRecipes = [];
      return;
    }

    // Update query params


    //this.allRecipeIdentities = this.recipeListService.GetRecipeIdentities();

    //console.log("Name(" + this.nameToFind + ")"); //debug

    // this.recipeListService.GetRecipes(
    this.recipeListService.GetRecipesFromAirtable(
      this.allDrinkTypes, this.allDrinkOccasions, this.allPreparationStyles, this.allFamilies, this.muddlingRequired,
      this.allPrimaryComponents, this.allSecondaryComponents, this.recipeNameToFind
    ).pipe(
      // tap(response => {
      //   console.log('Recipes(' + JSON.stringify(response) + ')'); //debug
      // }),
      map(response => {
      let allRecipes = response.records.map(
        recipeObj => {
          //console.log(recipeObj.fields);

          let model: RecipeModel = {
            id: recipeObj.fields["Recipe ID"],
            name: recipeObj.fields["Name"],
            variant: '',
            version: 0,
            type: recipeObj.fields["Type Name"][0],
            allLiquorIngredientNames: []
          }

          if(recipeObj.fields["Recipe Liquor Ingredient Names"] !== null
          && recipeObj.fields["Recipe Liquor Ingredient Names"] !== undefined
          && recipeObj.fields["Recipe Liquor Ingredient Names"].length > 0) {
            model.allLiquorIngredientNames = recipeObj.fields["Recipe Liquor Ingredient Names"];
          }

          let variant: string = recipeObj.fields["Variant"];
          if (variant !== null && variant !== undefined) {
            model.variant = variant;
          }

          // console.log("Name(" + model.name + "), Variant(" + model.variant + ")");  //debug

          let version: number = recipeObj.fields["Version"];
          if (version !== null && version !== undefined && isNaN(version) !== true) {
            model.version = version;
          }

          return model;
        }
      )

      return allRecipes;
    }))
      .subscribe((data: RecipeModel[]) => {
        let filteredList = data.filter(
          n => n !== null && n !== undefined
            && n.name !== null && n.name !== undefined
            && n.id !== null && n.id !== undefined && isNaN(n.id) !== true
        ); // Remove blanks

        // // start debug
        // for(let i in filteredList) {
        //   let item = filteredList[i];
        //   console.log(item);  //debug
        // }
        // // end debug

        let sortedList = filteredList.sort(
          (a, b) => a.name.localeCompare(b.name) !== 0 ? a.name.localeCompare(b.name) : a.variant.localeCompare(b.variant)
        );  // Sort

        // // start debug
        // for(let i in filteredList) {
        //   let item = filteredList[i];
        //   console.log(item);  //debug
        // }
        // // end debug

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        // // start debug
        // for(let i in filteredList) {
        //   let item = filteredList[i];
        //   console.log(item);  //debug
        // }
        // // end debug

        // // start debug
        // for(let i in filteredList) {
        //   let n = filteredList[i];

        //   let subArr = filteredList.filter(o => o.name === n.name && o.type === n.type);
        //   console.log("Similar(" + subArr.length + ")");  //debug

        //   if(subArr.length <= 1) {
        //     continue;
        //   }

        //   for(let j in subArr) {
        //     let subItem = subArr[j];
        //     console.log(subItem);  //debug
        //   }
        // }
        // // end debug

        filteredList = filteredList.filter(n => n.version ===
          filteredList.filter(o => o.name === n.name && o.type === n.type && o.variant === n.variant)
            .reduce((previous, current) => (previous.version > current.version) ? previous : current)
            .version
        ); // Return only most recent version

        // Filter to available
        if (this.limitToAvailable === true && this.userId > 0 && Object.keys(this.allAvailableLiquorIngredients).length > 0) {
          console.log("Liquors(" + Object.keys(this.allAvailableLiquorIngredients).join("; ") + ")"); //debug

          filteredList = filteredList.filter(recipe => {
            console.log("Recipe(" + recipe.name + ")"); //debug

            let allAvailable = true;

            for(let ingredient of recipe.allLiquorIngredientNames) {
              let isAvailable = ingredient in this.allAvailableLiquorIngredients;
              console.log("Ingredient(" + ingredient + "), Available(" + isAvailable + ")"); //debug

              if(isAvailable === true) {
                continue;
              }

              allAvailable = false;
              break;
            }

            console.log("Available(" + allAvailable + ")"); //debug

            return allAvailable;
          });
        }

        this.allRecipes = filteredList;
      });
  }

  getAllRecipesObservable(allTypes: string[], allOccasions: string[], allPrepStyles: string[], allFamilies: string[],
    muddlingReq: boolean, allPrimaryComponents: string[], allSecondaryComponents: string[], recipeName: string,
    allAvailableLiquors: string[][]
  ): Observable<RecipeModel[]> {
    // console.log('getAllRecipesObservable([' + allTypes + '], [' + allOccasions + '], [' + allPrepStyles 
    // + '], [' + allFamilies + '], ' + muddlingReq + ', [' + allPrimaryComponents + '], [' + allSecondaryComponents
    // + '], "' + recipeName + '")'); //debug

    // console.log("Getting recipes"); //debug

    // this.recipeListService.GetRecipes(
    let allRecipes: Observable<RecipeModel[]> = this.recipeListService.GetRecipesFromAirtable(
      allTypes, allOccasions, allPrepStyles, allFamilies, muddlingReq,
      allPrimaryComponents, allSecondaryComponents, recipeName, allAvailableLiquors
    ).pipe(map(response => {
      let allRecipes: RecipeModel[] = response.records.map(
        recipeObj => {
          // console.log('Recipe ' + recipeObj.fields["Recipe ID"] +'(' + recipeObj.fields["Name"] + ')');  //debug

          let model: RecipeModel = {
            id: recipeObj.fields["Recipe ID"],
            name: recipeObj.fields["Name"],
            variant: '',
            version: 0,
            type: recipeObj.fields["Type"],
            allLiquorIngredientNames: []
          }

          let variant: string = recipeObj.fields["Variant"];
          if (variant !== null && variant !== undefined) {
            model.variant = variant;
          }

          let version: number = recipeObj.fields["Version"];
          if (version !== null && version !== undefined && isNaN(version) !== true) {
            model.version = version;
          }

          return model;
        }
      )

      return allRecipes;
    }));

    return allRecipes
  }

  getAllIngredientsForRecipeObservable(recipe: RecipeModel): Observable<RecipeIngredientModel[]> {
    // console.log('getAllIngredientsForRecipeObservable(' + recipe.name + ')');  //debug

    let allIngredients: Observable<RecipeIngredientModel[]> = this.ingredientService.GetIngredientsForRecipeFromAirtable(recipe.id)
      .pipe(
        map(response => {
          let allIngredientObjs: RecipeIngredientModel[] = response.records.map(
            ingredientObj => {
              let typeModel: IngredientTypeModel = {
                name: ingredientObj.fields["Ingredient Type Name"],
                superType: ingredientObj.fields["Supertype"][0],
                type: ingredientObj.fields["Type"][0],
                subType: ingredientObj.fields["Subtype"][0]
              };

              let model: RecipeIngredientModel = {
                id: ingredientObj.fields["Recipe Ingredient ID"],
                order: ingredientObj.fields["Order"],
                name: ingredientObj.fields["Ingredient Name"][0],
                qualifier: ingredientObj.fields["Qualifier"],
                optional: ingredientObj.fields["Optional"] ? ingredientObj.fields["Optional"] : false,
                type: typeModel,
                amountReq: {},
                notes: ingredientObj.fields["Notes"]
              }

              for (let i = 0; i < this.allFields.length; i++) {
                let fieldName: string = this.allFields[i][0];
                let value: string = ingredientObj.fields[fieldName];

                if (value === null || value === undefined || value.length == 0) {
                  continue;
                }

                model.amountReq[fieldName.toLowerCase()] = { units: this.allFields[i][1], amount: value };
              }

              // Add type info
              model.type = {
                name: ingredientObj.fields["Ingredient Name"],
                superType: ingredientObj.fields["Ingredient Supertype"],
                type: ingredientObj.fields["Ingredient Type"],
                subType: ingredientObj.fields["Ingredient Subtype"]
              }

              return model;
            }
          )

          return allIngredientObjs;
        }));

    return allIngredients;
  }

  getAllIngredientsForRecipeListObservable(allRecipeIds: number[]): Observable<RecipeIngredientModel[]> {
    // console.log('getAllIngredientsForRecipeListObservable(' + allRecipeIds + ')');  //debug

    let allIngredients: Observable<RecipeIngredientModel[]> =
      this.ingredientService.GetIngredientsForRecipeListFromAirtable(allRecipeIds)
        .pipe(
          map(response => {
            let allIngredientObjs: RecipeIngredientModel[] = response.records.map(
              ingredientObj => {
                let typeModel: IngredientTypeModel = {
                  name: ingredientObj.fields["Ingredient Type Name"],
                  superType: ""
                };

                if(ingredientObj.fields["Supertype"] !== null
                && ingredientObj.fields["Supertype"] !== undefined
                && ingredientObj.fields["Supertype"].length > 0) {
                  typeModel.superType = ingredientObj.fields["Supertype"][0];
                }
                if(ingredientObj.fields["Type"] !== null
                && ingredientObj.fields["Type"] !== undefined
                && ingredientObj.fields["Type"].length > 0) {
                  typeModel.superType = ingredientObj.fields["Type"][0];
                }
                if(ingredientObj.fields["Subtype"] !== null
                && ingredientObj.fields["Subtype"] !== undefined
                && ingredientObj.fields["Subtype"].length > 0) {
                  typeModel.superType = ingredientObj.fields["Subtype"][0];
                }

                let model: RecipeIngredientModel = {
                  id: ingredientObj.fields["Recipe Ingredient ID"],
                  order: ingredientObj.fields["Order"],
                  name: ingredientObj.fields["Ingredient Name"][0],
                  qualifier: ingredientObj.fields["Qualifier"],
                  recipeId: ingredientObj.fields["Recipe ID"],
                  optional: ingredientObj.fields["Optional"] ? ingredientObj.fields["Optional"] : false,
                  type: typeModel,
                  amountReq: {},
                  notes: ingredientObj.fields["Notes"]
                }

                for (let i = 0; i < this.allFields.length; i++) {
                  let fieldName: string = this.allFields[i][0];
                  let value: string = ingredientObj.fields[fieldName];

                  if (value === null || value === undefined || value.length == 0) {
                    continue;
                  }

                  model.amountReq[fieldName.toLowerCase()] = { units: this.allFields[i][1], amount: value };
                }

                // Add type info
                model.type = {
                  name: ingredientObj.fields["Ingredient Type Name"],
                  superType: ingredientObj.fields["Supertype"],
                  type: ingredientObj.fields["Type"],
                  subType: ingredientObj.fields["Subtype"]
                }

                return model;
              }
            )

            return allIngredientObjs;
          }));

    return allIngredients;
  }

  getIngredientQuantityObservable(inventoryName: string, ingredientName: string): Observable<number> {
    let ingredientQuantity: Observable<number> = this.inventoryService.GetIngredientQuantitiesFromAirtable(
      inventoryName, ingredientName)
      .pipe(
        map(response => {
          let quantity = 0;

          let allLiquorObjs = response.records.map(
            liquorObj => {
              let model = {
                brand: liquorObj.fields["Brand"][0],
                desc: liquorObj.fields["Description"][0],
                volume: liquorObj.fields["Current Volume (mL)"]
              }

              if ("specialValue" in model.volume) {
                model.volume = -1;
              }

              if (model.volume > 0) {
                quantity += model.volume;
              }

              // return model;
            }
          )

          return quantity;
        }));

    return ingredientQuantity;
  }

  filterListToAvailableTypes(allSpirits: { [type: string]: LiquorModel[]; },
    allNonSpirits: { [type: string]: LiquorModel[]; }, allRecipes: RecipeModel[]): RecipeModel[] {
    // console.log('filterListToAvailableTypes(Spirits: ' + Object.keys(allSpirits) + ', Non-Spirits:'
      // + Object.keys(allNonSpirits) + ', Recipes: ' + allRecipes.length + ')');  //debug

    let allFilteredRecipes = new Array();

    for (let recipe of allRecipes) {
      // console.log("Recipe " + recipe.id + "(" + recipe.name + ")"); //debug
      // console.log('Recipe(' + JSON.stringify(recipe) + ')');  //debug

      let allIngredients = recipe.allIngredients;
      if (allIngredients === null || allIngredients === undefined) {
        continue;
      }

      // console.log("Total Ingredients(" + allIngredients.length + ")");  //debug

      let available: boolean = true;
      for (let ingredient of allIngredients) {
        let ingredientName: string = ingredient.name;
        // console.log("Ingredient(" + ingredientName + ")"); //debug

        let ingredientType = ingredient.type;
        if (ingredientType === null || ingredientType === undefined) {
          console.log('Failed to load ingredient type info for ' + ingredientName); //debug
          available = false;
          break;
        }

        let typeName: string = ingredientType.name;
        // console.log("Ingredient Type Name(" + typeName + ")");  //debug

        let superType: string = ingredientType.superType;
        // console.log("Ingredient Super Type(" + superType + ")"); //debug

        if (superType != 'Liquor') {
          continue;
        }

        // console.log("Recipe " + recipe.id + "(" + recipe.name + ")"); //debug
        // console.log("Ingredient(" + ingredientName + ")"); //debug

        // continue; //testing

        let type: string = ingredientType.type;
        // console.log("Ingredient Type(" + type + ")"); //debug

        let allAvailableLiquors: { [type: string]: LiquorModel[] };
        if (type == 'Spirit') {
          allAvailableLiquors = allSpirits;
        } else {
          allAvailableLiquors = allNonSpirits;
        }

        if (!(typeName in allAvailableLiquors)) {
          available = false;
          // console.log('Failed to find ' + typeName + ' in available liquors');  //debug
          break;
        }

        let subType = ingredientType.subType;
        // console.log("Ingredient Subtype(" + subType + ")"); //debug

        // console.log('Ingredient Name(' + ingredientName + ')'); //debug
        // console.log("Ingredient Type Name(" + typeName + ")");  //debug

        let fullType: string = superType + '/' + type + '/' + subType;
        // console.log('Ingredient Type(' + fullType + ')');  //debug

        let exactIngredientMatch = false;
        let allPossibleLiquorMatches: {[liquorName: string]: string} = {};
        let allLiquors: LiquorModel[] = allAvailableLiquors[typeName];
        for (let liquor of allLiquors) {
          // console.log('Avail Liquor Ingredient Names(' + liquor.ingredientNames + ')');  //debug
          if (liquor.ingredientNames === null || liquor.ingredientNames === undefined) {
            continue;
          }

          let liquorName: string = liquor.name;
          // console.log("Liquor Name(" + liquorName + ")"); //debug

          let liquorIngredientType = liquor.ingredientType;
          let liquorFullType: string = liquorIngredientType.superType + '/' + liquorIngredientType.type 
          + '/' + liquorIngredientType.subType;
          // console.log('Liquor Type(' + liquorFullType + ')');  //debug

          if(fullType != liquorFullType) {
            console.log('Failed to match full type "' + fullType + '" to "' + liquorFullType + '"');  //debug
          }

          for (let liquorIngredientName of liquor.ingredientNames) {
            // console.log('Liquor Ingredient Name(' + liquorIngredientName + ')');  //debug

            if (liquorIngredientName != ingredientName) {
              continue;
            }

            exactIngredientMatch = true;
            break;
          }

          if(exactIngredientMatch === true) {
            break;
          }

          if(liquorName in allPossibleLiquorMatches) {
            continue;
          }

          allPossibleLiquorMatches[liquorName] = liquorName;
        }

        if (exactIngredientMatch === true) {
          continue;
        }

        // available = false;  // Need exact match

        if (ingredient.notes === null || ingredient.notes === undefined) {
          ingredient.notes = '';
        }

        if (ingredient.notes.length > 0) {
          ingredient.notes += '; ';
        }

        let possibleMatchList: string = Object.keys(allPossibleLiquorMatches).join(', ');
        // console.log('Possible Substitutes(' + possibleMatchList + ')');  //debug

        ingredient.notes += 'No exact match found. Possible substitutes: ' + possibleMatchList;
        console.log("Matched ingredient type(" + typeName + ") but not ingredient name(" + ingredientName + ")");  //debug
      }

      if (available !== true) {
        continue;
      }

      allFilteredRecipes.push(recipe);
    }

    return allFilteredRecipes;
  }

  filterListToAvailableQuantities(allSpirits: { [type: string]: LiquorModel[]; },
    allNonSpirits: { [type: string]: LiquorModel[]; }, recipeList: RecipeModel[]): RecipeModel[] {
    let filteredList = new Array();

    for (let recipe of recipeList) {
      console.log("Recipe " + recipe.id + "(" + recipe.name + ")"); //debug

      let allIngredients = recipe.allIngredients;
      // console.log("Total Ingredients(" + allIngredients.length + ")");  //debug

      let unavailable: boolean = false;
      for (let ingredient of allIngredients) {
        console.log("Ingredient(" + ingredient.name + ")"); //debug

        let superType = ingredient.type.superType;
        console.log("Super Type(" + superType + ")"); //debug

        if (superType !== "Liquor") {
          continue;
        }

        let name = ingredient.type.subType;

        let millilitresAvail = ingredient.amountAvailable.millilitres;
        if (millilitresAvail === 0) {
          unavailable = true;
          break;
        }

        let millilitresReq = 0;

        // TODO: convert other req units for comparison if mL not available

        if (ingredient.amountReq.millilitres) {
          let amount: string = ingredient.amountReq.millilitres.amount;
          console.log("Amount(" + amount + ")");  //debug

          if (amount.indexOf('-') !== -1) {
            amount = amount.split('-')[1];
            console.log("Amount(" + amount + ")");  //debug
          }

          let num: number = parseFloat(amount);
          if (isNaN(num) !== true) {
            millilitresReq = num;
          }
        }

        recipe.missingIngredients = millilitresReq > millilitresAvail;
      }

      if (unavailable === true) {
        continue;
      }

      filteredList.push(recipe);
    }

    return filteredList;
  }

  private getIngredientsWithType(recipeId: number): RecipeIngredientModel[] {
    let allIngredients: RecipeIngredientModel[] = [];

    // Get ingredients
    this.ingredientService.GetIngredientsForRecipeFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allIngredientObjs: RecipeIngredientModel[] = response.records.map(
            ingredientObj => {
              let typeModel: IngredientTypeModel = {
                name: ingredientObj.fields["Ingredient Type Name"],
                superType: ingredientObj.fields["Supertype"][0],
                type: ingredientObj.fields["Type"][0],
                subType: ingredientObj.fields["Subtype"][0]
              };

              let model: RecipeIngredientModel = {
                id: ingredientObj.fields["Recipe Ingredient ID"],
                order: ingredientObj.fields["Order"],
                name: ingredientObj.fields["Ingredient Name"][0],
                /*qualifier: ingredientObj.fields[""],*/
                optional: ingredientObj.fields["Optional"] ? ingredientObj.fields["Optional"] : false,
                type: typeModel,
                amountReq: {},
                notes: ingredientObj.fields["Notes"]
              }

              for (let i = 0; i < this.allFields.length; i++) {
                let fieldName: string = this.allFields[i][0];
                let value: string = ingredientObj.fields[fieldName];

                if (value === null || value === undefined || value.length == 0) {
                  continue;
                }

                model.amountReq[fieldName.toLowerCase()] = { units: this.allFields[i][1], amount: value };
              }

              return model;
            }
          )

          return allIngredientObjs;
        })).subscribe((data: RecipeIngredientModel[]) => {
          let allModels: RecipeIngredientModel[] = data;

          let filteredList = allModels.filter(n => n !== null && n !== undefined); // Remove blanks
          filteredList = filteredList.filter((n, i) => filteredList.indexOf(n) === i); // Remove duplicates

          allIngredients = filteredList;

          // Get ingredient types
          for (let ingredient of allIngredients) {
            this.ingredientService.GetIngredientTypeFromAirtable(ingredient.name)
              .pipe(
                map(response => {
                  response.records.map(
                    ingredientTypeObj => {
                      let model: IngredientTypeModel = {
                        name: ingredientTypeObj.fields["Name"],
                        superType: ingredientTypeObj.fields["Supertype"],
                        type: ingredientTypeObj.fields["Type"],
                        subType: ingredientTypeObj.fields["Subtype"],
                        qualifier: ingredientTypeObj.fields["Qualifier"],
                        aged: ingredientTypeObj.fields["Aged"],
                        notes: ingredientTypeObj.fields["Notes"]
                      }

                      ingredient.type = model;
                    }
                  )
                }));
          }
        });

    console.log("Total Ingredients(" + allIngredients.length + ")");  //debug

    return allIngredients;
  }

  // getLiquorVolumes(liquorName: string, inventoryAddress: string): {ounces: number, millilitres: number} {
  //   let volumes = {ounces: 0, millilitres: 0};

  //   let allLiquors: LiquorModel[] = [];

  //   this.ingredientService.GetLiquorFromAirtable(liquorName)
  //   .pipe(
  //     map(response => {
  //     let allLiquors = response.records.map(
  //       liquorObj => {
  //         let allIngredientNames = liquorObj.fields["Ingredient Type"];
  //         let nameMatch: boolean = false;

  //         for(let name of allIngredientNames) {
  //           if(name !== liquorName) {
  //             continue;
  //           }

  //           nameMatch = true;
  //           break;
  //         }

  //         if(nameMatch !== true) {
  //           return;
  //         }

  //         // TODO
  //         let ingredientModel: IngredientTypeModel = {
  //           name: 'placeholder',
  //           superType: 'Liquor'
  //         }

  //         let model: LiquorModel = {
  //           id: liquorObj.fields["ID"],
  //           brand: liquorObj.fields["Brand"],
  //           description: liquorObj.fields["Description"],
  //           ingredientNames: liquorObj.fields,
  //           ingredientType: allIngredientNames,
  //           ounces: 0,
  //           millilitres: 0
  //         }

  //         return model;
  //       }
  //     )

  //     return allLiquors;
  //   })).subscribe((data: LiquorModel[]) => {
  //     let allModels: LiquorModel[] = data;

  //     let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

  //     allLiquors = filteredList;
  //   });

  //   for(let liquor of allLiquors) {
  //     this.inventoryService.GetLiquorVolumeFromAirtable(liquor.brand, liquor.description, inventoryAddress)
  //     .pipe(
  //       map(response => {
  //       let allLiquors = response.records.map(
  //         liquorObj => {
  //           let oz: number = liquorObj.fields['Current Volume (oz)'];
  //           volumes.ounces += oz;

  //           let ml: number = liquorObj.fields['Current Volume (mL)'];
  //           volumes.millilitres += ml;
  //         }
  //       )}));
  //   }

  //   return volumes;
  // }

  onSelect(recipe: RecipeModel): void {
    // // this.ingredientService.GetIngredients(
    //   this.ingredientService.GetIngredientsFromAirtable(
    //   recipe.id).subscribe((data: any) => {recipe.allIngredients = data.records;});

    // // this.directionService.GetDirections(
    //   this.directionService.GetDirectionsFromAirtable(
    //   recipe.id).subscribe((data: any) => {recipe.allDirections = data.records; });

    this.selectedRecipe = recipe;
  }

  onChangePage(recipePage: Array<RecipeModel>) {
    // update current page of recipes
    this.currentRecipePage = recipePage;
  }

  getVariantSuffix(recipe: RecipeModel) {
    let suffix = '';

    if (recipe.variant === null || recipe.variant === undefined || recipe.variant.length === 0) {
      return suffix;
    }

    suffix = '; ' + recipe.variant;
    return suffix;
  }
}
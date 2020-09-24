import { InventoryService } from './../Services/inventory.service';
import { LiquorModel } from './../Models/liquor-model';
import { IngredientTypeModel } from './../Models/Ingredient-type-model';
import { RecipeModel } from './../Models/recipe-model';
import { IngredientModel } from '../Models/ingredient-model';
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

  @Input('types') allDrinkTypes: string[] = ['all'];
  @Input('occassions') allDrinkOccassions: string[] = ['all'];
  @Input('styles') allPreparationStyles:string[] = ['all'];
  @Input('families') allFamilies: string[] = ['all'];
  @Input('muddling') muddlingRequired: boolean = false;
  @Input('primaries') allPrimaryComponents: string[] = ['all'];
  @Input('secondaries') allSecondaryComponents: string[] = ['all'];
  @Input('name') recipeNameToFind: string = '';
  @Input('inventory') inventoryAddr: string = '';
  @Input('limit') limitToAvailable: boolean = false;

  constructor(private recipeListService: RecipeListService, 
    private ingredientService: RecipeIngredientsService, 
    private directionService: RecipeDirectionsService,
    private inventoryService: InventoryService
    ) { }

  ngOnInit(): void {
    this.allRecipes = [];

    // this.updateRecipeList();
  }

  ngOnChanges(): void {
    //console.log("Limit(" + this.limitToAvailable + "), Inventory(" + this.inventoryAddr + ")"); //debug
        
      // if(this.limitToAvailable === true && this.inventoryAddr.length > 0) {
      //   this.updateLimitedRecipeList();
      //   return;
      // }

      this.updateRecipeList();
  }

  updateRecipeList(): void {
    this.allRecipes = [];

    // console.log("Types(" + this.allDrinkTypes + ")"); //debug
    // console.log("Occassions(" + this.allDrinkOccassions + ")"); //debug
    // console.log("Styles(" + this.allPreparationStyles + ")"); //debug
    // console.log("Families(" + this.allFamilies + ")"); //debug
    // console.log("Primary(" + this.allPrimaryComponents + ")"); //debug
    // console.log("Secondary(" + this.allSecondaryComponents + ")"); //debug

    if(this.allDrinkTypes.length == 0 
      || this.allDrinkOccassions.length == 0
      || this.allPreparationStyles.length == 0 
      || this.allFamilies.length == 0
      || this.allPrimaryComponents.length == 0
      || this.allSecondaryComponents.length == 0) {
        this.allRecipes = [];
        return;
      }

    //this.allRecipeIdentities = this.recipeListService.GetRecipeIdentities();

    //console.log("Name(" + this.nameToFind + ")"); //debug

    // this.recipeListService.GetRecipes(
    this.recipeListService.GetRecipesFromAirtable(
      this.allDrinkTypes, this.allDrinkOccassions, this.allPreparationStyles, this.allFamilies, this.muddlingRequired, 
      this.allPrimaryComponents, this.allSecondaryComponents, this.recipeNameToFind
      ).pipe(map(response => {
        let allRecipes = response.records.map(
          recipeObj => {
            //console.log(recipeObj.fields);

            let model: RecipeModel = {
              id: recipeObj.fields["Recipe ID"],
              name: recipeObj.fields["Name"],
              variant: '',
              version: 0,
              type: recipeObj.fields["Type"]
            }

            let variant: string = recipeObj.fields["Variant"];
            if(variant !== null && variant !== undefined) {
              model.variant = variant;
            }

            let version: number = recipeObj.fields["Version"];
            if(version !== null && version !== undefined && isNaN(version) !== true) {
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
        
        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

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

        filteredList = filteredList.filter((n) => n.version === 
          filteredList.filter(o => o.name === n.name && o.type === n.type)
          .reduce((previous, current) => (previous.version > current.version) ? previous : current)
          .version
          ); // Return only most recent version

        this.allRecipes = filteredList;
      });
  }

  // updateLimitedRecipeList(): void {
  //   this.allRecipes = [];

  //   // console.log("Types(" + this.allDrinkTypes + ")"); //debug
  //   // console.log("Occassions(" + this.allDrinkOccassions + ")"); //debug
  //   // console.log("Styles(" + this.allPreparationStyles + ")"); //debug
  //   // console.log("Families(" + this.allFamilies + ")"); //debug
  //   // console.log("Primary(" + this.allPrimaryComponents + ")"); //debug
  //   // console.log("Secondary(" + this.allSecondaryComponents + ")"); //debug

  //   if(this.allDrinkTypes.length == 0 
  //     || this.allDrinkOccassions.length == 0
  //     || this.allPreparationStyles.length == 0 
  //     || this.allFamilies.length == 0
  //     || this.allPrimaryComponents.length == 0
  //     || this.allSecondaryComponents.length == 0) {
  //       this.allRecipes = [];
  //       return;
  //     }

  //   //this.allRecipeIdentities = this.recipeListService.GetRecipeIdentities();

  //   //console.log("Name(" + this.nameToFind + ")"); //debug

  //   let allRecipes: Observable<RecipeModel[]> = this.getAllRecipesObservable(this.allDrinkTypes, 
  //     this.allDrinkOccassions, this.allPreparationStyles, this.allFamilies, this.muddlingRequired, 
  //     this.allPrimaryComponents, this.allSecondaryComponents, this.recipeNameToFind)
  //   .pipe(
  //     tap(allRecipes => { 
  //       console.debug('Recipes(' + allRecipes + ')'); 
  //     }),
  //     concatMap(data => {
  //       let allRecipes = data;
  //       allRecipes.map(
  //         recipe => {
  //           let allIngredients: Observable<IngredientModel[]> = this.getAllIngredientsObservable(recipe);

  //           allIngredients.pipe(
  //             tap(allIngredients => {
  //               console.debug('Ingredients(' + allIngredients + ')');
  //             }),
  //             concatMap(data => {
  //               let allIngredients = data;
  //               allIngredients.map(
  //                 ingredient => {
  //                   let quantity: Observable<number> = 
  //                   this.getIngredientQuantityObservable(this.inventoryAddr, ingredient.type.name);
                    
  //                   quantity.pipe(
  //                     tap(quantity => {
  //                       console.debug('Quantity(' + quantity + ')');
  //                     })
  //                   )

  //                   return quantity;
  //                 }
  //               )
  //             })
  //           )

  //           return allIngredients;
  //         }
  //       )

  //       return allRecipes;
  //     })
  //   )

  //   allRecipes.subscribe((data: RecipeModel[]) => {
  //     let filteredList = data.filter(
  //       n => n !== null && n !== undefined
  //       && n.name !== null && n.name !== undefined
  //       && n.id !== null && n.id !== undefined && isNaN(n.id) !== true
  //       ); // Remove blanks

  //     // // start debug
  //     // for(let i in filteredList) {
  //     //   let item = filteredList[i];
  //     //   console.log(item);  //debug
  //     // }
  //     // // end debug
    
  //     let sortedList = filteredList.sort(
  //       (a, b) => a.name.localeCompare(b.name) !== 0 ? a.name.localeCompare(b.name) : a.variant.localeCompare(b.variant)
  //     );  // Sort
      
  //     filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

  //     // // start debug
  //     // for(let i in filteredList) {
  //     //   let n = filteredList[i];

  //     //   let subArr = filteredList.filter(o => o.name === n.name && o.type === n.type);
  //     //   console.log("Similar(" + subArr.length + ")");  //debug

  //     //   if(subArr.length <= 1) {
  //     //     continue;
  //     //   }

  //     //   for(let j in subArr) {
  //     //     let subItem = subArr[j];
  //     //     console.log(subItem);  //debug
  //     //   }
  //     // }
  //     // // end debug

  //     filteredList = filteredList.filter((n) => n.version === 
  //       filteredList.filter(o => o.name === n.name && o.type === n.type)
  //       .reduce((previous, current) => (previous.version > current.version) ? previous : current)
  //       .version
  //       ); // Return only most recent version

  //     filteredList = this.filterListToAvailable(filteredList);

  //     this.allRecipes = filteredList;
  //   });
  // }

  getAllRecipesObservable(allTypes: string[], allOccassions: string[], allPrepStyles: string[], allFamilies: string[],
    muddlingReq: boolean, allPrimaryComponents: string[], allSecondaryComponents: string[], recipeName: string
    ): Observable<RecipeModel[]> {
    // this.recipeListService.GetRecipes(
    let allRecipes: Observable<RecipeModel[]> = this.recipeListService.GetRecipesFromAirtable(
      allTypes, allOccassions, allPrepStyles, allFamilies, muddlingReq, 
      allPrimaryComponents, allSecondaryComponents, recipeName
    ).pipe(map(response => {
      let allRecipes: RecipeModel[] = response.records.map(
        recipeObj => {
          //console.log(recipeObj.fields);

          let model: RecipeModel = {
            id: recipeObj.fields["Recipe ID"],
            name: recipeObj.fields["Name"],
            variant: '',
            version: 0,
            type: recipeObj.fields["Type"]
          }

          let variant: string = recipeObj.fields["Variant"];
          if(variant !== null && variant !== undefined) {
            model.variant = variant;
          }

          let version: number = recipeObj.fields["Version"];
          if(version !== null && version !== undefined && isNaN(version) !== true) {
            model.version = version;
          }

          return model;
        }
      )

      return allRecipes;
    }));

    return allRecipes
  }

  getAllIngredientsObservable(recipe: RecipeModel): Observable<IngredientModel[]> {
    let allIngredients: Observable<IngredientModel[]> = this.ingredientService.GetIngredientsFromAirtable(recipe.id)
    .pipe(
      map(response => {
      let allIngredientObjs: IngredientModel[] = response.records.map(
        ingredientObj => {
          let model: IngredientModel = {
            order: ingredientObj.fields["Order"],
            name: ingredientObj.fields["Ingredient Name"][0],
            qualifier: ingredientObj.fields["Qualifier"],
            optional: ingredientObj.fields["Optional"] ? ingredientObj.fields["Optional"] : false,
            amountReq: { },
            notes: ingredientObj.fields["Notes"]
          }

          let allFields: [string, string][] = [["Cups", "cup"], ["Ounces", "oz"], ["Millilitres", "mL"], ["Quantity", ""], ["Grams", "g"], 
            ["Dashes", ""], ["Barspoons", "barspoons"], ["Teaspoons", "tsp"], ["Misc", ""]];
          for(let i = 0; i < allFields.length; i++) {   
            let fieldName: string = allFields[i][0];
            let value: string = ingredientObj.fields[fieldName];

            if(value === null || value === undefined || value.length == 0) {
              continue;
            }

            model.amountReq[fieldName.toLowerCase()] = {units: allFields[i][1], amount: value};
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

            if("specialValue" in model.volume) {
              model.volume = -1;
            }

            if(model.volume > 0) {
              quantity += model.volume;
            }

            // return model;
          }
        )

        return quantity;
      }));

    return ingredientQuantity;
  }

  filterListToAvailable(recipeList: RecipeModel[]): RecipeModel[] {
    let filteredList = new Array();

    for(let recipe of recipeList) {
      console.log("Recipe " + recipe.id + "(" + recipe.name + ")"); //debug

      let allIngredients = recipe.allIngredients;
      // console.log("Total Ingredients(" + allIngredients.length + ")");  //debug

      let unavailable: boolean = false;
      for(let ingredient of allIngredients) {
        console.log("Ingredient(" + ingredient.name + ")"); //debug

        let superType = ingredient.type.superType;
        console.log("Super Type(" + superType + ")"); //debug

        if(superType !== "Liquor") {
          continue;
        }

        let name = ingredient.type.subType;

        let millilitresAvail = ingredient.amountAvailable.millilitres;
        if(millilitresAvail === 0) {
          unavailable = true;
          break;
        }

        let millilitresReq = 0;

        // TODO: convert other req units for comparison if mL not available

        if(ingredient.amountReq.millilitres) {
          let amount: string = ingredient.amountReq.millilitres.amount;
          console.log("Amount(" + amount + ")");  //debug

          if(amount.indexOf('-') !== -1) {
            amount = amount.split('-')[1];
            console.log("Amount(" + amount + ")");  //debug
          }

          let num: number = parseFloat(amount);
          if(isNaN(num) !== true) {
            millilitresReq = num;
          }
        }

        recipe.missingIngredients = millilitresReq > millilitresAvail;
      }

      if(unavailable === true) {
        continue;
      }

      filteredList.push(recipe);
    }

    return filteredList;
  }

  private getIngredientsWithType(recipeId: number): IngredientModel[] {
    let allIngredients: IngredientModel[] = [];

    // Get ingredients
    this.ingredientService.GetIngredientsFromAirtable(recipeId)
    .pipe(
      map(response => {
      let allIngredientObjs: IngredientModel[] = response.records.map(
        ingredientObj => {
          let model: IngredientModel = {
            order: ingredientObj.fields["Order"],
            name: ingredientObj.fields["Ingredient Name"][0],
            /*qualifier: ingredientObj.fields[""],*/
            optional: ingredientObj.fields["Optional"] ? ingredientObj.fields["Optional"] : false,
            amountReq: { },
            notes: ingredientObj.fields["Notes"]
          }

          let allFields: [string, string][] = [["Cups", "cup"], ["Ounces", "oz"], ["Millilitres", "mL"], ["Quantity", ""], ["Grams", "g"], 
            ["Dashes", ""], ["Barspoons", "barspoons"], ["Teaspoons", "tsp"], ["Misc", ""]];
          for(let i = 0; i < allFields.length; i++) {   
            let fieldName: string = allFields[i][0];
            let value: string = ingredientObj.fields[fieldName];

            if(value === null || value === undefined || value.length == 0) {
              continue;
            }

            model.amountReq[fieldName.toLowerCase()] = {units: allFields[i][1], amount: value};
          }

          return model;
        }
      )

      return allIngredientObjs;
    })).subscribe((data: IngredientModel[]) => {
      let allModels: IngredientModel[] = data;
  
      let filteredList = allModels.filter(n => n !== null && n !== undefined); // Remove blanks
      filteredList = filteredList.filter((n, i) => filteredList.indexOf(n) === i); // Remove duplicates

      allIngredients = filteredList;

      // Get ingredient types
      for(let ingredient of allIngredients) {
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

  getLiquorVolumes(liquorName: string, inventoryAddress: string): {ounces: number, millilitres: number} {
    let volumes = {ounces: 0, millilitres: 0};

    let allLiquors: LiquorModel[] = [];

    this.ingredientService.GetLiquorFromAirtable(liquorName)
    .pipe(
      map(response => {
      let allLiquors = response.records.map(
        liquorObj => {
          let allIngredientNames = liquorObj.fields["Ingredient Type"];
          let nameMatch: boolean = false;

          for(let name of allIngredientNames) {
            if(name !== liquorName) {
              continue;
            }

            nameMatch = true;
            break;
          }

          if(nameMatch !== true) {
            return;
          }

          // TODO
          let ingredientModel: IngredientTypeModel = {
            name: 'placeholder',
            superType: 'Liquor'
          }

          let model: LiquorModel = {
            id: liquorObj.fields["ID"],
            brand: liquorObj.fields["Brand"],
            description: liquorObj.fields["Description"],
            ingredientType: ingredientModel,
            ounces: 0,
            millilitres: 0
          }

          return model;
        }
      )

      return allLiquors;
    })).subscribe((data: LiquorModel[]) => {
      let allModels: LiquorModel[] = data;

      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

      allLiquors = filteredList;
    });

    for(let liquor of allLiquors) {
      this.inventoryService.GetLiquorVolumeFromAirtable(liquor.brand, liquor.description, inventoryAddress)
      .pipe(
        map(response => {
        let allLiquors = response.records.map(
          liquorObj => {
            let oz: number = liquorObj.fields['Current Volume (oz)'];
            volumes.ounces += oz;

            let ml: number = liquorObj.fields['Current Volume (mL)'];
            volumes.millilitres += ml;
          }
        )}));
    }

    return volumes;
  }

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

    if(recipe.variant === null || recipe.variant === undefined || recipe.variant.length === 0) {
      return suffix;
    }

    suffix = '; ' + recipe.variant;
    return suffix;
  }
}
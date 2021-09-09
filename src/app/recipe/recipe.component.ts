import { IngredientTypeModel } from './../Models/Ingredient-type-model';
import { RecipeModel } from './../Models/recipe-model';
import { DirectionModel } from './../Models/direction-model';
import { IngredientModel, IngredientAmountModel } from './../Models/ingredient-model';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.sass']
})
export class RecipeComponent implements OnInit, OnChanges {
  @Input() id: number;
  @Input() name: string;
  @Input() variant: string;
  @Input() recipe: RecipeModel;
  allIngredientIndexesByOrder: { [order: number]: number[] }
  allIngredientOrders: number[];
  allIngredients: IngredientModel[];
  allDirections: DirectionModel[];

  constructor(private ingredientService: RecipeIngredientsService, private directionService: RecipeDirectionsService) { }

  ngOnInit(): void {
    this.allIngredientIndexesByOrder = {};
    this.allIngredientOrders = [];
    this.allIngredients = [];
    this.allDirections = [];

    // this.updateIngredients(this.id);
    // this.updateDirections(this.id);
  }

  ngOnChanges(): void {
    if (this.recipe === null || this.recipe === undefined) {
      return;
    }

    this.id = this.recipe.id;
    this.name = this.recipe.name;
    this.variant = this.recipe.variant;

    // this.updateIngredients(this.id);
    // this.updateDirections(this.id);
    this.updateIngredients(this.recipe);
    this.updateDirections(this.recipe.id);
  }

  private updateIngredients(recipe: RecipeModel) {
    this.allIngredientIndexesByOrder = {};
    this.allIngredientOrders = [];
    this.allIngredients = [];

    // // Start with existing
    // if (recipe.allIngredients !== null
    //   && recipe.allIngredients !== undefined
    //   && recipe.allIngredients.length > 0) {
    //   // Organize ingredients by index and order #
    //   for (let i = 0; i < recipe.allIngredients.length; i++) {
    //     let model = recipe.allIngredients[i];
    //     let allIndexes = this.allIngredientIndexesByOrder[model.order];

    //     if (allIndexes === null || allIndexes === undefined) {
    //       allIndexes = [];
    //       this.allIngredientOrders.push(model.order);
    //       // console.log("Added array for order " + model.order);  //debug
    //     }

    //     allIndexes.unshift(i);  // Reverse order
    //     this.allIngredientIndexesByOrder[model.order] = allIndexes;
    //   }

    //   this.allIngredients = recipe.allIngredients;
    // }

    // this.ingredientService.GetIngredients(id)
    this.ingredientService.GetIngredientsForRecipeFromAirtable(recipe.id)
      .pipe(
        map(response => {
          let allIngredients = response.records.map(
            ingredientObj => {
              // for(let i in ingredientObj.fields) {
              //   console.log(i + "(" + ingredientObj.fields[i] + ")");
              // }
              // console.log("Name(" + ingredientObj.fields["Ingredient Name"] + ")"); //debug
              // console.log("Order(" + ingredientObj.fields["Order"] + ")"); //debug
              // console.log("Quantity(" + ingredientObj.fields["Quantity"] + ")"); //debug

              let typeModel: IngredientTypeModel = {
                name: ingredientObj.fields["Ingredient Type Name"],
                superType: ingredientObj.fields["Supertype"][0],
              };

              if (ingredientObj.fields["Type"] !== null
                && ingredientObj.fields["Type"] !== undefined
                && ingredientObj.fields["Type"].length > 0) {
                typeModel.type = ingredientObj.fields["Type"][0];
              }

              if (ingredientObj.fields["Subtype"] !== null
                && ingredientObj.fields["Subtype"] !== undefined
                && ingredientObj.fields["Subtype"].length > 0) {
                typeModel.subType = ingredientObj.fields["Subtype"][0];
              }

              let model: IngredientModel = {
                id: ingredientObj.fields["Recipe Ingredient ID"],
                order: ingredientObj.fields["Order"],
                name: ingredientObj.fields["Ingredient Name"][0],
                qualifier: ingredientObj.fields["Qualifier"],
                optional: ingredientObj.fields["Optional"] ? ingredientObj.fields["Optional"] : false,
                type: typeModel,
                amountReq: {},
                notes: ingredientObj.fields["Notes"]
              };

              let allFields: [string, string][] = [["Ounces", "oz"], ["Millilitres", "mL"],
              ["Quantity", ""], ["Grams", "g"], ["Dashes", "dashes of"], ["Barspoons (tsp)", "barspoons/tsp"],
              ["Cups", "cup"]];
              for (let i = 0; i < allFields.length; i++) {
                let fieldName: string = allFields[i][0];
                let value: string = ingredientObj.fields[fieldName];
                // console.log(fieldName + "(" + value + ")"); //debug

                if (value === null || value === undefined || value.length == 0) {
                  //console.log(fieldName + " is invalid");
                  continue;
                }

                model.amountReq[fieldName.toLowerCase()] = { units: allFields[i][1], amount: value };
              }

              // // start debug
              // for(let amount in model.amounts) {
              //   console.log(amount + "(" + model.amounts[amount] + ")"); //debug
              // }
              // // end debug

              return model;
            }
          )

          return allIngredients;
        }))
      .subscribe((data: IngredientModel[]) => {
        let allModels: IngredientModel[] = data;
        // console.log('Unsorted:'); //debug
        // for(let i in allModels) {
        //   let model = allModels[i];
        //   console.log(model); //debug
        // }

        let filteredList = data.filter(n =>
          n !== null && n !== undefined
          && n.id !== null && n.id !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.order - b.order);  // Sort

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        // Replace details with existing
        if (recipe.allIngredients !== null && recipe.allIngredients !== undefined && recipe.allIngredients.length > 0) {
          // console.log('Total ingredients Before(' + filteredList.length + ')');  //debug

          filteredList = filteredList.map((ingredient: IngredientModel) => {
            let match = recipe.allIngredients.find(existing => existing.id === ingredient.id);
            if (match === null || match === undefined) {
              return ingredient;
            }

            // console.log(match.name + ' Notes 4(' + match.notes + ')');  //debug

            // //debug
            // if (match) {
            //   for (let key in match) {
            //     console.log(key + '(' + match[key] + ')');  //debug
            //   }
            // }
            // //end debug
            // console.log('ID(' + (match || ingredient).id + '), Notes(' + (match || ingredient).notes + ')');  //debug

            return match;
          });

          // console.log('Total ingredients After(' + filteredList.length + ')');  //debug
        }

        // Organize ingredients by index and order #
        for (let i = 0; i < filteredList.length; i++) {
          let ingredient: IngredientModel = filteredList[i];
          let allIndexes = this.allIngredientIndexesByOrder[ingredient.order];

          if (allIndexes === null || allIndexes === undefined) {
            allIndexes = [];
            this.allIngredientOrders.push(ingredient.order);
            // console.log("Added array for order " + model.order);  //debug
          }

          allIndexes.unshift(i);  // Reverse order
          this.allIngredientIndexesByOrder[ingredient.order] = allIndexes;
        }

        // // start debug
        // for(let order in this.allIngredientIndexesByOrder) {
        //   let allIndexes = this.allIngredientIndexesByOrder[order];

        //   let debug = order + "[" + allIndexes.join(", ") + "]";  //debug
        //   for(let i in allIndexes) {
        //     let index = allIndexes[i];
        //     //console.log("Index(" + index + ")");  //debug

        //     let ingredient = filteredList[index];
        //     if(ingredient === null || ingredient === undefined) {
        //       continue;
        //     }

        //     debug += ', ' + ingredient.name;
        //   }

        //   console.log(debug); //debug
        // }
        // // end debug

        this.allIngredients = filteredList;
      });
  }

  private updateDirections(recipeId) {
    this.allDirections = [];

    // this.directionService.GetDirections(id)
    this.directionService.GetDirectionsFromAirtable(recipeId)
      .pipe(map(response => {
        let allDirections = response.records.map(
          directionObj => {
            let model = {
              step: directionObj.fields["Step"],
              direction: directionObj.fields["Direction"],
              optional: directionObj.fields["Optional"] ? directionObj.fields["Optional"] : false
            }

            return model;
          }
        )

        return allDirections;
      }))
      .subscribe((data: DirectionModel[]) => {
        let allModels: DirectionModel[] = data;

        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.step - b.step);  // Sort

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allDirections = filteredList;
      });
  }

  getVariantSuffix(variant: string) {
    let suffix = '';

    if (variant === null || variant === undefined && variant.length > 0) {
      suffix += ': ' + variant + ' variant';
    }

    return suffix;
  }

  getIngredientDesc(order: number): string {
    // console.log("Order(" + order + ")"); //debug

    let allIndexes = this.allIngredientIndexesByOrder[order];
    //console.log("All Indexes(" + allIndexes + ")"); //debug

    let desc: string = "";

    let prevAmountDesc = "";
    for (let i in allIndexes) {
      let index = allIndexes[i];
      // console.log("Index(" + index + ")");  //debug

      let ingredient: IngredientModel = this.allIngredients[index];
      // console.log("Ingredient(" + ingredient.name + ")"); //debug

      let allIngredientAmounts = ingredient.amountReq;
      //console.log("Ingredient Index " + index + ":"); //debug

      let amountDesc = "";

      for (let field in allIngredientAmounts) {
        let ingredientAmount: IngredientAmountModel = allIngredientAmounts[field];
        let amount: string = ingredientAmount.amount;
        // console.log(field + "(" + amount + ")");  //debug

        if (amount === null || amount === undefined || amount.length === 0) {
          console.log(amount + " is invalid");
          continue;
        }

        if (amountDesc.length > 0) {
          amountDesc += " / ";
        }

        amountDesc += amount;

        let unit: string = ingredientAmount.units;
        if (unit.length > 0) {
          amountDesc += " " + unit;
        }
      }

      if (desc.length > 0) {
        desc += " or ";
      }

      // console.log("Previous(" + prevAmountDesc + ")");  //debug
      // console.log("Current(" + amountDesc + ")"); //debug
      // console.log("Match(" + (amountDesc === prevAmountDesc) + ")"); //debug

      // Add amounts
      if ((prevAmountDesc.length == 0 && amountDesc.length > 0) || amountDesc !== prevAmountDesc) {
        // console.log("Amounts don't match"); //debug
        desc += amountDesc + " ";
      }

      prevAmountDesc = amountDesc;

      desc += ingredient.name;

      // Add qualifier
      // console.log("Ingredient(" + ingredient.qualifier + ")"); //debug
      if (ingredient.qualifier !== null && ingredient.qualifier !== undefined && ingredient.qualifier.length > 0) {
        desc += ' - ' + ingredient.qualifier;
      }

      // Add notes
      let notes: string = '';

      // Add ingredient quantity deficiences
      // notes += this.getDeficiency(ingredient);

      if (ingredient.notes !== null && ingredient.notes !== undefined && ingredient.notes.length > 0) {
        // console.log(ingredient.name + ' Notes(' + ingredient.notes + ')');  //debug

        if (notes.length > 0) {
          notes += '; ';
        }

        notes += ingredient.notes;
      }

      if (notes.length > 0) {
        desc += " (" + notes + ")";
      }
    }

    return desc;
  }

  getDeficiency(ingredient: IngredientModel) {
    let deficiency = '';

    if (ingredient.amountAvailable === null || ingredient.amountAvailable === undefined
      || isNaN(ingredient.amountAvailable.millilitres) == true) {
      return deficiency;
    }

    let available = ingredient.amountAvailable.millilitres;
    let amount = ingredient.amountReq.millilitres.amount;
    let units = ingredient.amountReq.millilitres.units;

    // TODO: convert other req units for comparison if mL not available

    if (amount.indexOf('-') !== -1) {
      amount = amount.split('-')[1];
    }

    let req = parseFloat(amount);
    if (isNaN(req) === true) {
      return deficiency;
    }

    if (available >= req) {
      return deficiency;
    }

    let diff = req - available;

    deficiency = 'Short ' + diff + ' ' + units;
    return deficiency;
  }

  getIsOptional(order: number): boolean {
    let allIndexes = this.allIngredientIndexesByOrder[order];
    //console.log("All Indexes(" + allIndexes + ")"); //debug

    let optional: boolean = false;
    for (let i in allIndexes) {
      let index = allIndexes[i];
      // console.log("Index(" + index + ")");  //debug

      let ingredient: IngredientModel = this.allIngredients[index];
      if (ingredient.optional !== true) {
        continue;
      }

      optional = true;
      break;
    }

    return optional;
  }
}
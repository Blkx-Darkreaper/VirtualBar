import { DirectionModel } from './../Models/direction-model';
import { IngredientModel, IngredientAmountModel } from './../Models/ingredient-model';
//import { Recipe } from './../recipe';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { RecipeModel } from '../Models/recipe-model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.sass']
})
export class RecipeComponent implements OnInit, OnChanges {
  @Input() id: number;
  @Input() name: string;
  @Input() variant: string;
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
    this.updateIngredients(this.id);
    this.updateDirections(this.id);
  }

  private updateIngredients(id) {
    this.allIngredientIndexesByOrder = {};
    this.allIngredientOrders = [];
    this.allIngredients = [];

    // this.ingredientService.GetIngredients(id)
    this.ingredientService.GetIngredientsFromAirtable(id)
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

          let model: IngredientModel = {
            order: ingredientObj.fields["Order"],
            name: ingredientObj.fields["Ingredient Name"][0],
            /*qualifier: ingredientObj.fields[""],*/
            amounts: { },
            notes: ingredientObj.fields["Notes"]
          }

          let allFields: [string, string][] = [["Cups", "cup"], ["Ounces", "oz"], ["Millilitres", "mL"], ["Quantity", ""], ["Grams", "g"], 
            ["Dashes", ""], ["Barspoons", "barspoons"], ["Teaspoons", "tsp"]];
          for(let i = 0; i < allFields.length; i++) {   
            let fieldName: string = allFields[i][0];
            let value: number = ingredientObj.fields[fieldName];
            // console.log(fieldName + "(" + value + ")"); //debug

            if(isNullOrUndefined(value) === true || isNaN(value) === true) {
              //console.log(fieldName + " is invalid");
              continue;
            }

            model.amounts[fieldName.toLowerCase()] = {units: allFields[i][1], amount: value};
          }

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

      allModels.sort((a, b) => a.order - b.order);  // Sort

      // Organize ingredients by index and order #
      for(let i = 0; i < allModels.length; i++) {
        let model = allModels[i];
        let allIndexes = this.allIngredientIndexesByOrder[model.order];
        
        if(isNullOrUndefined(allIndexes)) {
          allIndexes = [];
          this.allIngredientOrders.push(model.order);
          // console.log("Added array for order " + model.order);  //debug
        }

        allIndexes.unshift(i);  // Reverse order
        this.allIngredientIndexesByOrder[model.order] = allIndexes;
      }

      /* // start debug
      for(let order in this.allIngredientIndexesByOrder) {
        let allIndexes = this.allIngredientIndexesByOrder[order];

        let debug = order + "[" + allIndexes.join(", ") + "]";  //debug
        for(let i in allIndexes) {
          let index = allIndexes[i];
          //console.log("Index(" + index + ")");  //debug

          let ingredient = allModels[index];
          if(isNullOrUndefined(ingredient)) {
            continue;
          }

          debug += ', ' + ingredient.name;
        }

        console.log(debug); //debug
      }
      // end debug */

      // console.log('Sorted:' + allModels); //debug
      // for(let i in allModels) {
      //   let model = allModels[i];
      //   console.log(model); //debug
      // }

      this.allIngredients = allModels;
    });
  }

  private updateDirections(id) {
    this.allDirections = [];

    // this.directionService.GetDirections(id)
    this.directionService.GetDirectionsFromAirtable(id)
    .pipe(map(response => {
      let allDirections = response.records.map(
        directionObj => {
          let model = {
            step: directionObj.fields["Step"],
            direction: directionObj.fields["Direction"]
          }

          return model;
        }
      )

      return allDirections;
    }))
    .subscribe((data: DirectionModel[]) => {
      let allModels: DirectionModel[] = data;
      allModels.sort((a, b) => a.step - b.step);  // Sort
      this.allDirections = allModels;
    });
  }

  getVariantSuffix(variant: string) {
    let suffix = '';

    if(isNullOrUndefined(variant) !== true && variant.length > 0) {
      suffix += ': ' + variant + ' version';
    }

    return suffix;
  }

  getIngredientDesc(order: number) {
    // console.log("Order(" + order + ")"); //debug

    let allIndexes = this.allIngredientIndexesByOrder[order];
    //console.log("All Indexes(" + allIndexes + ")"); //debug

    let desc: string = "";

    let prevAmountDesc = "";
    for(let i in allIndexes) {
      let index = allIndexes[i];
      // console.log("Index(" + index + ")");  //debug

      let ingredient: IngredientModel = this.allIngredients[index];
      // console.log("Ingredient(" + ingredient.name + ")"); //debug

      let allIngredientAmounts = ingredient.amounts;
      //console.log("Ingredient Index " + index + ":"); //debug

      let amountDesc = "";
      for(let field in allIngredientAmounts) {
        let ingredientAmount: IngredientAmountModel = allIngredientAmounts[field];
        let amount: string = ingredientAmount.amount;
        // console.log(field + "(" + amount + ")");  //debug

        if(isNullOrUndefined(amount) === true || amount.length === 0) {
          console.log(amount + " is invalid");
          continue;
        }

        if(amountDesc.length > 0) {
          amountDesc += " / ";
        }

        amountDesc += amount;

        let unit: string = ingredientAmount.units;
        if(unit.length > 0) {
          amountDesc += " " + unit;
        }
      }

      if(desc.length > 0) {
        desc += " or ";
      }

      // console.log("Previous(" + prevAmountDesc + ")");  //debug
      // console.log("Current(" + amountDesc + ")"); //debug
      // console.log("Match(" + (amountDesc === prevAmountDesc) + ")"); //debug

      if((prevAmountDesc.length == 0 && amountDesc.length > 0) || amountDesc !== prevAmountDesc) {
        // console.log("Amounts don't match"); //debug
        desc += amountDesc + " ";
      }

      prevAmountDesc = amountDesc;

      desc += ingredient.name;

      if(isNullOrUndefined(ingredient.notes) !== true && ingredient.notes.length > 0) {
        desc += " (" + ingredient.notes + ")";
      }
    }

    return desc;
  }
}
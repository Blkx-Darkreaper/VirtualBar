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
  allIngredients: IngredientModel[];
  allDirections: DirectionModel[];

  constructor(private ingredientService: RecipeIngredientsService, private directionService: RecipeDirectionsService) { }

  ngOnInit(): void {
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
            //console.log(fieldName + "(" + value + ")"); //debug

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

  getIngredientDesc(index: number) {
    let ingredient: IngredientModel = this.allIngredients[index];
    let allIngredientAmounts = ingredient.amounts;
    //console.log("Ingredient " + index + ":"); //debug

    let desc: string = "";
    for(let field in allIngredientAmounts) {
      let ingredientAmount: IngredientAmountModel = allIngredientAmounts[field];
      let amount: number = ingredientAmount.amount;
      //console.log(field + "(" + amount + ")");  //debug

      if(isNullOrUndefined(amount) === true || isNaN(amount) === true) {
        console.log(amount + " is invalid");
        continue;
      }

      if(desc.length > 0) {
        desc += " / ";
      }

      let unit: string = ingredientAmount.units;
      desc += amount + " " + unit;
    }

    desc += " " + ingredient.name;

    if(isNullOrUndefined(ingredient.notes) !== true && ingredient.notes.length > 0) {
      desc += " (" + ingredient.notes + ")";
    }

    return desc;
  }
}
import { RecipeListService } from '../Services/recipe-list.service';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { RecipeModel } from '../Models/recipe-model';

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
  @Input('primaries') allPrimaryComponents: string[] = ['all'];
  @Input('secondaries') allSecondaryComponents: string[] = ['all'];
  @Input('limit') limitToAvailable: boolean = false;

  constructor(private recipeListService: RecipeListService, 
    private ingredientService: RecipeIngredientsService, 
    private directionService: RecipeDirectionsService) { }

  ngOnInit(): void {
    this.allRecipes = [];

    // this.updateRecipeList();
  }

  ngOnChanges(): void {
    this.updateRecipeList();
  }

  updateRecipeList() {
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

    // this.recipeListService.GetRecipes(
    this.recipeListService.GetRecipesFromAirtable(
      this.allDrinkTypes, this.allDrinkOccassions, this.allPreparationStyles, this.allFamilies, 
      this.allPrimaryComponents, this.allSecondaryComponents, this.limitToAvailable
      ).pipe(map(response => {
        let allRecipes = response.records.map(
          recipeObj => {
            //console.log(recipeObj.fields);

            let model: RecipeModel = {
              id: recipeObj.fields["Recipe ID"],
              name: recipeObj.fields["Name"]
            }

            let variant: string = recipeObj.fields["Variant"];
            if(isNullOrUndefined(variant) !== true) {
              model.variant = variant;
            } else {
              model.variant = '';
            }

            return model;
          }
        )

        return allRecipes;
      }))
      .subscribe((data: RecipeModel[]) => {
        let filteredList = data.filter(
          n => isNullOrUndefined(n) !== true 
          && isNullOrUndefined(n.name) !== true 
          && isNullOrUndefined(n.id) !== true && isNaN(n.id) !== true
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

        this.allRecipes = filteredList;
      });
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

    if(isNullOrUndefined(recipe.variant) !== true && recipe.variant.length > 0) {
      suffix += '; ' + recipe.variant;
    }

    return suffix;
  }
}
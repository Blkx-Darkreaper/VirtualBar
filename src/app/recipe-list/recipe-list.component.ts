import { RecipeListService } from '../Services/recipe-list.service';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';
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
  @Input('styles') allPreparationStyles:string[] = ['all'];
  @Input('families') allFamilies: string[] = ['all'];
  @Input('primaries') allPrimaryComponents: string[] = ['all'];
  @Input('secondaries') allSecondaryComponents: string[] = ['all'];
  @Input('limit') limitToAvailable: boolean = false;

  constructor(private recipeListService: RecipeListService, 
    private ingredientService: RecipeIngredientsService, 
    private directionService: RecipeDirectionsService) { }

  ngOnInit(): void {
    this.updateRecipeList();
  }

  ngOnChanges(): void {
    this.updateRecipeList();
  }

  updateRecipeList() {
    if(this.allDrinkTypes.length == 0 
      && this.allPreparationStyles.length == 0 
      && this.allFamilies.length == 0
      && this.allPrimaryComponents.length == 0
      && this.allSecondaryComponents.length == 0) {
        this.allRecipes = [];
        return;
      }

    //this.allRecipeIdentities = this.recipeListService.GetRecipeIdentities();

    this.recipeListService.GetRecipes(
    //this.recipeListService.GetRecipesFromAirtable(
      this.allDrinkTypes, this.allPreparationStyles, this.allFamilies, 
      this.allPrimaryComponents, this.allSecondaryComponents, this.limitToAvailable
      ).pipe(map(response => {
        let allRecipes = response.records.map(
          recipeObj => {
            return recipeObj.fields;
          }
        )

        return allRecipes;
      }))
      .subscribe((data: RecipeModel[]) => { this.allRecipes = data; });

      this.allRecipes.sort((a, b) => a.name.localeCompare(b.name));
  }

  onSelect(recipe: RecipeModel): void {
    this.ingredientService.GetIngredients(
      // this.ingredientService.GetIngredientsFromAirtable(
      recipe.id).subscribe((data: any) => {recipe.allIngredients = data.records;});

    this.directionService.GetDirections(
      // this.directionService.GetDirectionsFromAirtable(
      recipe.id).subscribe((data: any) => {recipe.allDirections = data.records; });

    this.selectedRecipe = recipe;
  }

  onChangePage(recipePage: Array<RecipeModel>) {
    // update current page of recipes
    this.currentRecipePage = recipePage;
  }
}
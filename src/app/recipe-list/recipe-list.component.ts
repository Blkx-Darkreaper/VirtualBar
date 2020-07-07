import { RecipeListService } from '../Services/recipe-list.service';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { RecipeModel } from '../recipe-model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.sass']
})
export class RecipeListComponent implements OnInit {
  title = "Recipes";
  allRecipes: RecipeModel[];
  selectedRecipe: RecipeModel;

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
}
import { RecipeListService } from '../Services/recipe-list.service';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input } from '@angular/core';
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

  @Input('types') drinkTypes: string[];
  @Input('styles') preparationStyles:string[];
  @Input() families: string[];
  @Input('primaries') primaryComponents: string[];
  @Input('secondaries') secondaryComponents: string[];
  @Input('limit') limitToAvailable: boolean;

  constructor(private recipeListService: RecipeListService, 
    private ingredientService: RecipeIngredientsService, 
    private directionService: RecipeDirectionsService) { }

  ngOnInit(): void {
    //this.allRecipeIdentities = this.recipeListService.GetRecipeIdentities();
    this.recipeListService.GetRecipes(
    //this.recipeListService.GetRecipesFromAirtable(
      this.drinkTypes, this.preparationStyles, this.families, 
      this.primaryComponents, this.secondaryComponents, this.limitToAvailable
      ).subscribe((data: any) => { this.allRecipes = data.records; });
  }

  onSelect(recipe: RecipeModel): void {
    this.ingredientService.GetIngredients(recipe).subscribe((data: any) => {recipe.allIngredients = data.ingredients;});
    this.directionService.GetDirections(recipe).subscribe((data: any) => {recipe.allDirections = data.directions; });

    this.selectedRecipe = recipe;
  }
}
import { RecipeListService } from './../recipe-list.service';
import { RecipeDirectionsService } from './../recipe-directions.service';
import { RecipeIngredientsService } from './../recipe-ingredients.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.sass']
})
export class RecipeComponent implements OnInit {
  name: string;
  variant: string;
  allIngredients: string[];
  allDirections: string[];

  constructor(recipeListService: RecipeListService){//, ingredientService: RecipeIngredientsService, directionService: RecipeDirectionsService) {

   }

  ngOnInit(): void {
    this.recipeListService.GetRecipeList().subscribe();
  }

}

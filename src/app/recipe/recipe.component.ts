//import { Recipe } from './../recipe';
import { RecipeDirectionsService } from '../Services/recipe-directions.service';
import { RecipeIngredientsService } from '../Services/recipe-ingredients.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.sass']
})
export class RecipeComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() variant: string;
  allIngredients: string[];
  allDirections: string[];

  constructor(private ingredientService: RecipeIngredientsService, private directionService: RecipeDirectionsService) {
   }

  ngOnInit(): void {
    // this.allIngredients = this.ingredientService.GetIngredients(name);
    // this.allDirections = this.directionService.GetDirections(name);
    this.ingredientService.GetIngredients(this.id).subscribe((data: any) => {this.allIngredients = data.ingredients;});
    this.directionService.GetDirections(this.id).subscribe((data: any) => {this.allDirections = data.directions;});
  }
}

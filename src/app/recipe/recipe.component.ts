import { RecipeModel } from './../recipe-model';
import { RecipeDirectionsService } from './../recipe-directions.service';
import { RecipeIngredientsService } from './../recipe-ingredients.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.sass']
})
export class RecipeComponent implements OnInit {
  @Input() name: string;
  @Input() variant: string;
  allIngredients: string[];
  allDirections: string[];

  constructor(private ingredientService: RecipeIngredientsService, private directionService: RecipeDirectionsService) {
   }

  ngOnInit(): void {
    let model: RecipeModel;
    model.name = this.name;
    model.variant = this.variant;

    // this.allIngredients = this.ingredientService.GetIngredients(name);
    // this.allDirections = this.directionService.GetDirections(name);
    this.ingredientService.GetIngredients(model).subscribe((data: any) => {this.allIngredients = data.ingredients;});
    this.directionService.GetDirections(model).subscribe((data: any) => {this.allDirections = data.directions;});
  }
}

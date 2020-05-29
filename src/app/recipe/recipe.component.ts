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
  @Input() allIngredients: string[];
  @Input() allDirections: string[];

  constructor(/*private ingredientService: RecipeIngredientsService, private directionService: RecipeDirectionsService*/) {
   }

  ngOnInit(): void {
    // this.allIngredients = this.ingredientService.GetIngredients(name);
    // this.allDirections = this.directionService.GetDirections(name);
    //this.ingredientService.GetIngredients(name).subscribe((data: any) => {this.allIngredients = data.ingredients;});
    //this.directionService.GetDirections(name).subscribe((data: any) => {this.allDirections = data.directions;});
  }

}

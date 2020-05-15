import { RecipeListService } from './../recipe-list.service';
import { Component, OnInit } from '@angular/core';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.sass']
})
export class RecipeListComponent implements OnInit {
  title = "Recipes";
  allRecipes: RecipeComponent[];

  constructor(service: RecipeListService) {
   }

  ngOnInit(): void {
  }
}
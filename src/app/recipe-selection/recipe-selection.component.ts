import { Inventory } from './../inventory.component';
import { IngredientInventoriesService } from './../ingredient-inventories.service';
import { RecipeComponentsService } from './../recipe-components.service';
import { RecipeCategoriesService } from './../recipe-categories.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-selection',
  templateUrl: './recipe-selection.component.html',
  styleUrls: ['./recipe-selection.component.sass']
})
export class RecipeSelectionComponent implements OnInit 
{
  allTypes: string[];
  allStyles: string[];
  allFamilies: string[];
  allPrimaryComponents: string[];
  allSecondaryComponents: string[];

  allInventories: Inventory[];

  limitToAvailable: boolean;

  constructor(recipeCategoryService: RecipeCategoriesService, 
    recipeComponentService: RecipeComponentsService, 
    ingredientInventory: IngredientInventoriesService) 
    { 
      this.allTypes = recipeCategoryService.GetTypes();
      this.allStyles = recipeCategoryService.GetStyles();
      this.allFamilies = recipeCategoryService.GetFamilies();
      this.allPrimaryComponents = recipeComponentService.GetPrimaries();
      this.allSecondaryComponents = recipeComponentService.GetSecondaries();

      this.allInventories = ingredientInventory.GetInventories();

      this.limitToAvailable = false;
    }

  ngOnInit(): void {
  }

}

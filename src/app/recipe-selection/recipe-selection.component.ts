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
  allFamilies: any;
  allPrimaryComponents: string[];
  allSecondaryComponents: string[];

  allInventories: Inventory[];

  allSelectedTypes: string[];
  allSelectedStyles: string[];
  allSelectedFamilies: string[];
  allSelectedPrimaryComponents: string[];
  allSelectedSecondaryComponents: string[];
  limitToAvailable: boolean;

  constructor(private recipeCategoryService: RecipeCategoriesService, 
    private recipeComponentService: RecipeComponentsService, 
    private ingredientInventory: IngredientInventoriesService) 
    { 
      this.limitToAvailable = false;
    }

  ngOnInit(): void {
    this.recipeCategoryService.GetTypes().subscribe((data: any) => {this.allTypes = data.types;});
    this.recipeCategoryService.GetStyles().subscribe((data: any) => {this.allStyles = data.styles;});
    this.recipeCategoryService.GetFamilies().subscribe((data: any) => {this.allFamilies = data.families;});
    this.recipeComponentService.GetPrimaries().subscribe((data: any) => {this.allPrimaryComponents = data.components;});
    this.recipeComponentService.GetSecondaries().subscribe((data: any) => {this.allSecondaryComponents = data.components;});

    this.ingredientInventory.GetInventories().subscribe((data: any) => {this.allInventories = JSON.parse(data.inventories);});
  }
}
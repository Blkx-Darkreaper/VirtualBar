import { Inventory } from './../inventory.component';
import { IngredientInventoriesService } from '../Services/ingredient-inventories.service';
import { RecipeComponentsService } from '../Services/recipe-components.service';
import { RecipeCategoriesService } from '../Services/recipe-categories.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

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

  selectionForm: FormGroup;
  typesForm: FormGroup;

  allSelectedTypes: [];
  allSelectedStyles: string[];
  allSelectedFamilies: string[];
  allSelectedPrimaryComponents: string[];
  allSelectedSecondaryComponents: string[];
  limitToAvailable: boolean;

  constructor(private formBuilder: FormBuilder,
    private recipeCategoryService: RecipeCategoriesService, 
    private recipeComponentService: RecipeComponentsService, 
    private ingredientInventory: IngredientInventoriesService
) 
    { 
      //this.selectionForm = this.formBuilder.group({});
      this.typesForm = this.formBuilder.group({ typesArray: this.formBuilder.array([]) });
      this.limitToAvailable = false;
    }

  get typesArray(): FormArray {
    return this.typesForm.controls.typesArray as FormArray;
  }

  ngOnInit(): void {
    this.recipeCategoryService.GetTypes().subscribe((data: any) => {this.allTypes = data.types;});
    this.recipeCategoryService.GetStyles().subscribe((data: any) => {this.allStyles = data.styles;});
    this.recipeCategoryService.GetFamilies().subscribe((data: any) => {this.allFamilies = data.families;});
    this.recipeComponentService.GetPrimaries().subscribe((data: any) => {this.allPrimaryComponents = data.components;});
    this.recipeComponentService.GetSecondaries().subscribe((data: any) => {this.allSecondaryComponents = data.components;});

    this.ingredientInventory.GetInventories().subscribe((data: any) => {this.allInventories = JSON.parse(data.inventories);});

    this.addTypes();
  }

  addTypes() {
    /* this.allTypes.forEach((o, i) => {
      const control: FormControl = new FormControl(true);

      (this.typesForm.controls.typesArray as FormArray).push(control);
    }); */

    for(let type in this.allTypes) {
      this.typesArray.push(this.formBuilder.control(true));
    }
  }

  onSubmit() {
      console.log(this.typesArray.value);
  }
}
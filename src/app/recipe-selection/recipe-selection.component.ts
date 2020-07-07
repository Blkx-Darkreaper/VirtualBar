import { Inventory } from './../inventory.component';
import { IngredientInventoriesService } from '../Services/ingredient-inventories.service';
import { RecipeComponentsService } from '../Services/recipe-components.service';
import { RecipeCategoriesService } from '../Services/recipe-categories.service';
import { Component, OnInit } from '@angular/core';
//import {ThemePalette} from '@angular/material/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

export interface Option {
  name: string;
  selected: boolean;
  //color: ThemePalette;
  subOptions?: Option[];
}

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

  // selectionForm: FormGroup;
  typesForm: FormGroup;

  allSelectedTypes: string[] = [];

  styleOptions: Option = {
    name: 'Style',
    selected: true,
    subOptions: [ ]
  };
  allSelectedStyles: string[] = [];
  allStylesSelected: boolean = true;

  allSelectedFamilies: string[] = [];

  allSelectedPrimaryComponents: string[] = [];

  allSelectedSecondaryComponents: string[] = [];

  limitToAvailable: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private recipeCategoryService: RecipeCategoriesService, 
    private recipeComponentService: RecipeComponentsService, 
    private ingredientInventory: IngredientInventoriesService
) { }

  get typesArray(): FormArray {
    return this.typesForm.controls.typesArray as FormArray;
  }

  // get types() {
  //   return this.typesForm.get('types');
  // }

  ngOnInit(): void {
    this.recipeCategoryService.GetTypes().subscribe((data: any) => {this.allTypes = data.types;});
    this.recipeCategoryService.GetStyles().subscribe((data: any) => {this.allStyles = data.styles;});
    this.recipeCategoryService.GetFamilies().subscribe((data: any) => {this.allFamilies = data.families;});
    this.recipeComponentService.GetPrimaries().subscribe((data: any) => {this.allPrimaryComponents = data.components;});
    this.recipeComponentService.GetSecondaries().subscribe((data: any) => {this.allSecondaryComponents = data.components;});

    this.ingredientInventory.GetInventories().subscribe((data: any) => {this.allInventories = JSON.parse(data.inventories);});

    //this.selectionForm = this.formBuilder.group({});

    this.typesForm = this.formBuilder.group({ typesArray: this.formBuilder.array([]) });
    for(let type in this.allTypes) {
      this.typesArray.push(this.formBuilder.control(true));
    }

    for(let i in this.allStyles) {
      let style = this.allStyles[i];
      this.styleOptions.subOptions.push({ name: style, selected: true});
    }

    this.updateSelectedStyles();
  }

  // addTypes() {
  //   /* this.allTypes.forEach((o, i) => {
  //     const control: FormControl = new FormControl(true);

  //     (this.typesForm.controls.typesArray as FormArray).push(control);
  //   }); */

  //   for(let type in this.allTypes) {
  //     this.typesArray.push(this.formBuilder.control(true));
  //   }
  // }

  // submitTypes() {
  //     console.log(this.typesArray.value);
  // }

  updateSelectedStyles() {
    this.allStylesSelected = this.styleOptions.subOptions != null && this.styleOptions.subOptions.every(o => o.selected);

    if(this.allStylesSelected == true) {
      this.allSelectedStyles = ["all"];
      return;
    }

    this.allSelectedStyles = [];
    for(let i in this.styleOptions.subOptions) {
      let style = this.styleOptions.subOptions[i];
      if(style.selected != true) {
        continue;
      }

      this.allSelectedStyles.push(style.name);
    }
  }

  areSomeStylesSelected(): boolean {
    if (this.styleOptions.subOptions == null) {
      return false;
    }

    return this.styleOptions.subOptions.filter(o => o.selected).length > 0 && !this.allStylesSelected;
  }

  setAllStylesSelected(name: string, selected: boolean) {
    console.log(name + ' checkbox has been set to ' + selected);  //debug

    this.allStylesSelected = selected;

    if (this.styleOptions.subOptions == null) {
      return;
    }

    this.styleOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedStyles();
  }

  toggleStyleSelected(name: string, selected: boolean) {
    console.log(name + ' checkbox has been set to ' + selected);  //debug

    this.updateSelectedStyles();
  }
}
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
  allFamilies: string[];
  allPrimaryComponents: string[];
  allSecondaryComponents: string[];

  allInventories: Inventory[];

  // selectionForm: FormGroup;

  typeOptions: Option = {
    name: 'Type',
    selected: true,
    subOptions: []
  };
  allSelectedTypes: string[] = [];
  areAllTypesSelected: boolean = true;

  styleOptions: Option = {
    name: 'Style',
    selected: true,
    subOptions: [ ]
  };
  allSelectedStyles: string[] = [];
  areAllStylesSelected: boolean = true;

  familyOptions: Option = {
    name: 'Family',
    selected: true,
    subOptions: []
  };
  allSelectedFamilies: string[] = [];
  areAllFamiliesSelected: boolean = true;

  primaryOptions: Option = {
    name: 'Main',
    selected: true,
    subOptions: []
  };
  allSelectedPrimaryComponents: string[] = [];
  areAllPrimaryComponentsSelected: boolean = true;

  secondaryOptions: Option = {
    name: 'Auxiliary',
    selected: true,
    subOptions: []
  };
  allSelectedSecondaryComponents: string[] = [];
  areAllSecondaryComponentsSelected: boolean = true;

  limitToAvailable: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private recipeCategoryService: RecipeCategoriesService, 
    private recipeComponentService: RecipeComponentsService, 
    private ingredientInventory: IngredientInventoriesService
) { }

  ngOnInit(): void {
    this.recipeCategoryService.GetTypes().subscribe((data: any) => {this.allTypes = data.types;});
    this.recipeCategoryService.GetStyles().subscribe((data: any) => {this.allStyles = data.styles;});
    this.recipeCategoryService.GetFamilies().subscribe((data: any) => {this.allFamilies = data.families;});
    this.recipeComponentService.GetPrimaries().subscribe((data: any) => {this.allPrimaryComponents = data.components;});
    this.recipeComponentService.GetSecondaries().subscribe((data: any) => {this.allSecondaryComponents = data.components;});

    this.ingredientInventory.GetInventories().subscribe((data: any) => {this.allInventories = JSON.parse(data.inventories);});

    //this.selectionForm = this.formBuilder.group({});

    let allGroups: string[][] = [this.allTypes, this.allStyles, this.allFamilies, 
      this.allPrimaryComponents, this.allSecondaryComponents];
    let allOptions: Option[] = [this.typeOptions, this.styleOptions, this.familyOptions,
      this.primaryOptions, this.secondaryOptions];

    for(let i in allGroups) {
      let option: Option = allOptions[i];

      let group = allGroups[i];
      for(let j in group) {
        let value = group[j];
        option.subOptions.push({ name: value, selected: true});
      }
    }

    this.updateSelectedTypes();
    this.updateSelectedStyles();
    this.updateSelectedFamilies();
    this.updateSelectedPrimaryComponents();
    this.updateSelectedSecondaryComponents();
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

  // areSomeStylesSelected(): boolean {
  //   if (this.styleOptions.subOptions == null) {
  //     return false;
  //   }

  //   return this.styleOptions.subOptions.filter(o => o.selected).length > 0 && !this.allStylesSelected;
  // }

  setGroupSelected(group: string, selected: boolean) {
    console.log(group + ' group checkboxes have been set to ' + selected);  //debug

    switch(group) {
      case "Type":
        this.setAllTypesSelected(selected);
        break;

      case "Style":
        this.setAllStylesSelected(selected);
        break;

        case "Family":
          this.setAllFamiliesSelected(selected);
          break;

          case "Main":
            this.setAllPrimaryComponentsSelected(selected);
            break;

            case "Auxiliary":
              this.setAllSecondaryComponentsSelected(selected);
              break;
    }
  }

  setAllTypesSelected(selected: boolean) {
    this.areAllTypesSelected = selected;

    if (this.typeOptions.subOptions == null) {
      return;
    }

    this.typeOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedTypes();
  }

  setAllStylesSelected(selected: boolean) {
    this.areAllStylesSelected = selected;

    if (this.styleOptions.subOptions == null) {
      return;
    }

    this.styleOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedStyles();
  }

  setAllFamiliesSelected(selected: boolean) {
    this.areAllFamiliesSelected = selected;

    if (this.familyOptions.subOptions == null) {
      return;
    }

    this.familyOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedFamilies();
  }

  setAllPrimaryComponentsSelected(selected: boolean) {
    this.areAllPrimaryComponentsSelected = selected;

    if (this.primaryOptions.subOptions == null) {
      return;
    }

    this.primaryOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedPrimaryComponents();
  }

  setAllSecondaryComponentsSelected(selected: boolean) {
    this.areAllSecondaryComponentsSelected = selected;

    if (this.secondaryOptions.subOptions == null) {
      return;
    }

    this.secondaryOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedSecondaryComponents();
  }

  toggleSelected(group: string, name: string, selected: boolean) {
    console.log(group + " " + name + ' checkbox has been set to ' + selected);  //debug

    switch(group) {
      case "Type":
        this.updateSelectedTypes();
        break;

      case "Style":
        this.updateSelectedStyles();
        break;

        case "Family":
          this.updateSelectedFamilies();
          break;

          case "Main":
            this.updateSelectedPrimaryComponents();
            break;

            case "Auxiliary":
              this.updateSelectedSecondaryComponents();
              break;
    }
  }

  updateSelectedTypes() {
    this.areAllTypesSelected = this.typeOptions.subOptions != null 
    && this.typeOptions.subOptions.every(o => o.selected);

    if(this.areAllTypesSelected == true) {
      this.allSelectedTypes = ["all"];
      return;
    }

    this.allSelectedTypes = [];
    for(let i in this.typeOptions.subOptions) {
      let type = this.typeOptions.subOptions[i];
      if(type.selected != true) {
        continue;
      }

      this.allSelectedTypes.push(type.name);
    }
  }

  updateSelectedStyles() {
    this.areAllStylesSelected = this.styleOptions.subOptions != null 
    && this.styleOptions.subOptions.every(o => o.selected);

    if(this.areAllStylesSelected == true) {
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

  updateSelectedFamilies() {
    this.areAllFamiliesSelected = this.familyOptions.subOptions != null 
    && this.familyOptions.subOptions.every(o => o.selected);

    if(this.areAllFamiliesSelected == true) {
      this.allSelectedFamilies = ["all"];
      return;
    }

    this.allSelectedFamilies = [];
    for(let i in this.familyOptions.subOptions) {
      let family = this.familyOptions.subOptions[i];
      if(family.selected != true) {
        continue;
      }

      this.allSelectedFamilies.push(family.name);
    }
  }

  updateSelectedPrimaryComponents() {
    this.areAllPrimaryComponentsSelected = this.primaryOptions.subOptions != null 
    && this.primaryOptions.subOptions.every(o => o.selected);

    if(this.areAllPrimaryComponentsSelected == true) {
      this.allSelectedPrimaryComponents = ["all"];
      return;
    }

    this.allSelectedPrimaryComponents = [];
    for(let i in this.primaryOptions.subOptions) {
      let primaryComponent = this.primaryOptions.subOptions[i];
      if(primaryComponent.selected != true) {
        continue;
      }

      this.allSelectedPrimaryComponents.push(primaryComponent.name);
    }
  }

  updateSelectedSecondaryComponents() {
    this.areAllSecondaryComponentsSelected = this.secondaryOptions.subOptions != null 
    && this.secondaryOptions.subOptions.every(o => o.selected);

    if(this.areAllSecondaryComponentsSelected == true) {
      this.allSelectedSecondaryComponents = ["all"];
      return;
    }

    this.allSelectedSecondaryComponents = [];
    for(let i in this.secondaryOptions.subOptions) {
      let secondaryComponent = this.secondaryOptions.subOptions[i];
      if(secondaryComponent.selected != true) {
        continue;
      }

      this.allSelectedSecondaryComponents.push(secondaryComponent.name);
    }
  }
}
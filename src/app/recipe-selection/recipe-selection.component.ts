import { InventoryService } from './../Services/inventory.service';
import { RecipeComponentsService } from '../Services/recipe-components.service';
import { RecipeCategoriesService } from '../Services/recipe-categories.service';
import { Component, OnInit } from '@angular/core';
//import {ThemePalette} from '@angular/material/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

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
  allOccassions: string[];
  allStyles: string[];
  allFamilies: string[];
  allPrimaryComponents: string[];
  allSecondaryComponents: string[];

  allInventories: string[];

  // selectionForm: FormGroup;

  typeOptions: Option = {
    name: 'Type',
    selected: true,
    subOptions: []
  };
  allSelectedTypes: string[] = ['all'];
  areAllTypesSelected: boolean = true;

  occassionOptions: Option = {
    name: 'Occassion',
    selected: true,
    subOptions: []
  };
  allSelectedOccassions: string[] = ['all'];
  areAllOccassionsSelected: boolean = true;

  styleOptions: Option = {
    name: 'Style',
    selected: true,
    subOptions: [ ]
  };
  allSelectedStyles: string[] = ['all'];
  areAllStylesSelected: boolean = true;

  familyOptions: Option = {
    name: 'Family',
    selected: true,
    subOptions: []
  };
  allSelectedFamilies: string[] = ['all'];
  areAllFamiliesSelected: boolean = true;

  primaryOptions: Option = {
    name: 'Main',
    selected: true,
    subOptions: []
  };
  allSelectedPrimaryComponents: string[] = ['all'];
  areAllPrimaryComponentsSelected: boolean = true;

  secondaryOptions: Option = {
    name: 'Auxiliary',
    selected: true,
    subOptions: []
  };
  allSelectedSecondaryComponents: string[] = ['all'];
  areAllSecondaryComponentsSelected: boolean = true;

  muddlingRequired: boolean = false;

  nameToFind: string = '';

  selectedInventory: string = '';
  limitToAvailable: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private recipeCategoryService: RecipeCategoriesService, 
    private recipeComponentService: RecipeComponentsService, 
    private inventoryService: InventoryService
) { }

  ngOnInit(): void {
    this.allTypes = [];
    this.allOccassions = [];
    this.allStyles = [];
    this.allFamilies = [];
    this.allPrimaryComponents = [];
    this.allSecondaryComponents = [];

    // this.recipeCategoryService.GetTypes()
    this.recipeCategoryService.GetTypesFromAirtable()
    .pipe(
      map(response => {
      let allValues = response.records.map(
        obj => { 
          return obj.fields.Name;
        }
      )

      return allValues;
    }))
    .subscribe((data: string[]) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      
      let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
      
      filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

      this.allTypes = filteredList;
      this.addSubOptions(filteredList, this.typeOptions);
      this.updateSelectedTypes();
    });

    // this.recipeCategoryService.GetOccassions()
    this.recipeCategoryService.GetOccassionsFromAirtable()
    .pipe(
      map(response => {
      let allValues = response.records.map(
        obj => { 
          return obj.fields.Name;
        }
      )

      return allValues;
    }))
    .subscribe((data: string[]) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      
      let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
      
      filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

      this.allOccassions = filteredList;
      this.addSubOptions(filteredList, this.occassionOptions);
      this.updateSelectedOccassions();
    });

    // this.recipeCategoryService.GetStyles()
    this.recipeCategoryService.GetStylesFromAirtable()
    .pipe(
      map(response => {
      let allValues = response.records.map(
        obj => { 
          return obj.fields.Name;
        }
      )

      return allValues;
    }))
    .subscribe((data: string[]) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      
      let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
      
      filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

      this.allStyles = filteredList;
      this.addSubOptions(filteredList, this.styleOptions);
      this.updateSelectedTypes();
    });

    // this.recipeCategoryService.GetFamilies()
    this.recipeCategoryService.GetFamiliesFromAirtable()
    .pipe(
      map(response => {
      let allValues = response.records.map(
        obj => { 
          return obj.fields.Name;
        }
      )

      return allValues;
    }))
    .subscribe((data: string[]) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      
      let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
      
      filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

      this.allFamilies = filteredList;
      this.addSubOptions(filteredList, this.familyOptions);
      this.updateSelectedFamilies();
    });

    // this.recipeComponentService.GetPrimaries()
    this.recipeComponentService.GetPrimariesFromAirtable()
    .pipe(
      map(response => {
      let allValues = response.records.map(
        obj => { 
          // return obj.fields.Name;
          return obj.fields.Name;
        }
      )

      return allValues;
    }))
    .subscribe((data: string[]) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      
      let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

      filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

      this.allPrimaryComponents = filteredList;
      this.addSubOptions(filteredList, this.primaryOptions);
      this.updateSelectedPrimaryComponents();
    });

    // this.recipeComponentService.GetSecondaries()
    this.recipeComponentService.GetSecondariesFromAirtable()
    .pipe(
      map(response => {
      let allValues = response.records.map(
        obj => { 
          // return obj.fields.Name;
          return obj.fields.Name;
        }
      )

      return allValues;
    }))
    .subscribe((data: string[]) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      
      let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
      
      filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

      // for(let i in filteredList) {
      //   console.log(filteredList[i]);  //debug
      // }

      this.allSecondaryComponents = filteredList;
      this.addSubOptions(filteredList, this.secondaryOptions);
      this.updateSelectedSecondaryComponents();
    });

    this.inventoryService.GetInventoriesFromAirtable()
    .pipe(map(response => {
      let allInventories = response.records.map(
        inventoryObj => {
          return inventoryObj.fields["Address"];
        }
      )

      return allInventories;
    }))
    .subscribe((data: any) => {
      let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        filteredList = filteredList.filter((n, i) => filteredList.indexOf(n) === i); // Remove duplicates

      this.allInventories = filteredList;
      
      if(this.allInventories !== null && this.allInventories !== undefined && this.allInventories.length > 0) {
        this.selectedInventory = this.allInventories[0];  // default to first element
      }
    });

    //this.selectionForm = this.formBuilder.group({});
  }

  protected addSubOptions(group: string[], option: Option) {
    for(let i in group) {
      let value = group[i];
      //console.log("Group Option(" + value + ")");  //debug

      option.subOptions.push({ name: value, selected: true});
    }
  }

  ngOnChanges() {
  //   console.log("Changes made");  //debug
    console.log("Inventory(" + this.selectedInventory + ")"); //debug

  //   this.allTypes.sort((a, b) => a.localeCompare(b));
  //   this.allOccassions.sort((a, b) => a.localeCompare(b));
  //   this.allStyles.sort((a, b) => a.localeCompare(b));
  //   this.allFamilies.sort((a, b) => a.localeCompare(b));
  //   this.allPrimaryComponents.sort((a, b) => a.localeCompare(b));
  //   this.allSecondaryComponents.sort((a, b) => a.localeCompare(b));

  //   let allGroups: string[][] = [this.allTypes, this.allOccassions, this.allStyles, this.allFamilies, 
  //     this.allPrimaryComponents, this.allSecondaryComponents];

  //   let allOptions: Option[] = [this.typeOptions, this.occassionOptions, this.styleOptions, this.familyOptions,
  //     this.primaryOptions, this.secondaryOptions];

  //   for(let i in allGroups) {
  //     let option: Option = allOptions[i];

  //     let group = allGroups[i];
  //     console.log("Group(" + group + ")");  //debug

  //     for(let j in group) {
  //       let value = group[j];
  //       console.log("Group Option(" + value + ")");  //debug

  //       option.subOptions.push({ name: value, selected: true});
  //     }
  //   }

  //   this.updateSelectedTypes();
  //   this.updateSelectedOccassions();
  //   this.updateSelectedStyles();
  //   this.updateSelectedFamilies();
  //   this.updateSelectedPrimaryComponents();
  //   this.updateSelectedSecondaryComponents();
  // }

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
  }

  setGroupSelected(group: string, selected: boolean) {
    console.log(group + ' group checkboxes have been set to ' + selected);  //debug

    switch(group) {
      case "Type":
        this.setAllTypesSelected(selected);
        break;

      case "Occassion":
        this.setAllOccassionsSelected(selected);
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

  setAllOccassionsSelected(selected: boolean) {
    this.areAllOccassionsSelected = selected;

    if (this.occassionOptions.subOptions == null) {
      return;
    }

    this.occassionOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedOccassions();
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

      case "Occassion":
        this.updateSelectedOccassions();
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
      //console.log("All Types selected");  //debug
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

  updateSelectedOccassions() {
    this.areAllOccassionsSelected = this.occassionOptions.subOptions != null 
    && this.occassionOptions.subOptions.every(o => o.selected);

    if(this.areAllOccassionsSelected == true) {
      this.allSelectedOccassions = ["all"];
      return;
    }

    this.allSelectedOccassions = [];
    for(let i in this.occassionOptions.subOptions) {
      let occassion = this.occassionOptions.subOptions[i];
      if(occassion.selected != true) {
        continue;
      }

      this.allSelectedOccassions.push(occassion.name);
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
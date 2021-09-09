import { IngredientTypeModel } from './../Models/Ingredient-type-model';
import { LiquorModel } from './../Models/liquor-model';
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
  enabled: boolean;
  //color: ThemePalette;
  subOptions?: Option[];
}

@Component({
  selector: 'app-recipe-selection',
  templateUrl: './recipe-selection.component.html',
  styleUrls: ['./recipe-selection.component.sass']
})
export class RecipeSelectionComponent implements OnInit {
  allTypes: string[];
  allOccasions: string[];
  allStyles: string[];
  allFamilies: string[];
  allPrimaryComponents: string[];
  allSecondaryComponents: string[];
  allTertiaryComponents: string[];

  allInventories: string[];

  // selectionForm: FormGroup;

  typeOptions: Option = {
    name: 'Type',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedTypes: string[] = ['all'];
  areAllTypesSelected: boolean = true;

  occasionOptions: Option = {
    name: 'Occasion',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedOccasions: string[] = ['all'];
  areAllOccasionsSelected: boolean = true;

  styleOptions: Option = {
    name: 'Style',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedStyles: string[] = ['all'];
  areAllStylesSelected: boolean = true;

  familyOptions: Option = {
    name: 'Family',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedFamilies: string[] = ['all'];
  areAllFamiliesSelected: boolean = true;

  primaryOptions: Option = {
    name: 'Main',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedPrimaryComponents: string[] = ['all'];
  areAllPrimaryComponentsSelected: boolean = true;

  secondaryOptions: Option = {
    name: 'Auxiliary',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedSecondaryComponents: string[] = ['all'];
  areAllSecondaryComponentsSelected: boolean = true;

  tertiaryOptions: Option = {
    name: 'Non-Alcoholic',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedTertiaryComponents: string[] = ['all'];
  areAllTertiaryComponentsSelected: boolean = true;

  muddlingRequired: boolean = false;

  nameToFind: string = '';

  selectedInventory: string = '';
  limitToAvailable: boolean = false;

  allAvailableSpirits: { [type: string]: LiquorModel[]; } = {};
  allAvailableNonSpirits: { [type: string]: LiquorModel[]; } = {};

  constructor(private formBuilder: FormBuilder,
    private recipeCategoryService: RecipeCategoriesService,
    private recipeComponentService: RecipeComponentsService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    // console.log("Inventory(" + this.selectedInventory + ")"); //debug

    this.updateSelectionChecklists();

    //this.selectionForm = this.formBuilder.group({});

    this.updateAvailableComponentsBasedOnInventory();
  }

  ngOnChanges() {
    //   console.log("Changes made");  //debug
    // console.log("Inventory(" + this.selectedInventory + ")"); //debug

    // this.updateSelectionChecklists();

    // this.updateAvailableBasedOnInventory();

    //   this.allTypes.sort((a, b) => a.localeCompare(b));
    //   this.allOccasions.sort((a, b) => a.localeCompare(b));
    //   this.allStyles.sort((a, b) => a.localeCompare(b));
    //   this.allFamilies.sort((a, b) => a.localeCompare(b));
    //   this.allPrimaryComponents.sort((a, b) => a.localeCompare(b));
    //   this.allSecondaryComponents.sort((a, b) => a.localeCompare(b));

    //   let allGroups: string[][] = [this.allTypes, this.allOccasions, this.allStyles, this.allFamilies, 
    //     this.allPrimaryComponents, this.allSecondaryComponents];

    //   let allOptions: Option[] = [this.typeOptions, this.occasionOptions, this.styleOptions, this.familyOptions,
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
    //   this.updateSelectedOccasions();
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

  private updateSelectionChecklists() {
    // console.log('updateSelectionChecklists()');  //debug

    this.allTypes = [];
    this.allOccasions = [];
    this.allStyles = [];
    this.allFamilies = [];
    this.allPrimaryComponents = [];
    this.allSecondaryComponents = [];
    this.allTertiaryComponents = [];

    this.getRecipeTypesObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allTypes = filteredList;
        this.addSubOptions(filteredList, this.typeOptions);
        this.updateSelectedTypes();
      });

    this.getRecipeOccasionsObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allOccasions = filteredList;
        this.addSubOptions(filteredList, this.occasionOptions);
        this.updateSelectedOccasions();
      });

    this.getRecipeStylesObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allStyles = filteredList;
        this.addSubOptions(filteredList, this.styleOptions);
        this.updateSelectedTypes();
      });

    this.getRecipeFamiliesObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allFamilies = filteredList;
        this.addSubOptions(filteredList, this.familyOptions);
        this.updateSelectedFamilies();
      });

    this.getRecipeMainComponentsObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allPrimaryComponents = filteredList;
        this.addSubOptions(filteredList, this.primaryOptions);
        this.updateSelectedPrimaryComponents();
      });

    this.getRecipeAuxComponentsObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        // console.log("Secondary Components:"); //debug
        // for(let i in filteredList) {
        //   console.log(filteredList[i]);  //debug
        // }

        this.allSecondaryComponents = filteredList;
        this.addSubOptions(filteredList, this.secondaryOptions);
        this.updateSelectedSecondaryComponents();
      });

      this.getRecipeTertComponentsObservable()
      .subscribe((data: string[]) => {
        // console.log("Total Tertiary components(" + data.length + ")");  //debug
        // for(let i in data) {
        //   console.log(data[i]);  //debug
        // }

        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates
        // console.log("Total Filtered Tertiary components(" + filteredList.length + ")");  //debug

        // console.log("Tertiary Components:"); //debug
        // for(let i in filteredList) {
        //   console.log(filteredList[i]);  //debug
        // }

        this.allTertiaryComponents = filteredList;
        this.addSubOptions(filteredList, this.tertiaryOptions);
        this.updateSelectedTertiaryComponents();
      });

    this.getInventoryListObservable()
      .subscribe((data: any) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        filteredList = filteredList.filter((n, i) => filteredList.indexOf(n) === i); // Remove duplicates

        this.allInventories = filteredList;
        // console.log("Inventories(" + this.allInventories + ")");  //debug

        if (this.allInventories !== null && this.allInventories !== undefined && this.allInventories.length > 0) {
          this.selectedInventory = this.allInventories[0];
          // console.log("Selected Inventory(" + this.selectedInventory + ")");  //debug

          this.updateAvailableComponentsBasedOnInventory();
        }
      });
  }

  private getInventoryListObservable() {
    return this.inventoryService.GetInventoriesFromAirtable()
      .pipe(map(response => {
        let allInventories = response.records.map(
          inventoryObj => {
            return inventoryObj.fields["Address"];
          }
        );

        return allInventories;
      }));
  }

  private getAvailableNonSpiritsObservable() {
    return this.inventoryService.GetNonSpiritLiquorTypesFromAirtable(this.selectedInventory)
      .pipe(map(response => {
        let allSpiritTypes = response.records.map(
          liquorObj => {
            let ingredientTypeModel: IngredientTypeModel = {
              name: liquorObj.fields["Ingredient Type Name"][0],
              superType: 'Liquor',
              type: liquorObj.fields["Type"][0],
              subType: liquorObj.fields["Subtype"][0]
            };

            let liquorModel: LiquorModel = {
              name: liquorObj.fields["Name"],
              brand: liquorObj.fields["Brand"],
              description: liquorObj.fields["Description"],
              ingredientNames: liquorObj.fields["Ingredient Names"],
              ingredientType: ingredientTypeModel
            };

            return liquorModel;
          }
        );

        return allSpiritTypes;
      }));
  }

  private getAvailableSpiritsObservable() {
    return this.inventoryService.GetSpiritLiquorTypesFromAirtable(this.selectedInventory)
      .pipe(map(response => {
        let allSpiritTypes = response.records.map(
          liquorObj => {
            let ingredientTypeModel: IngredientTypeModel = {
              name: liquorObj.fields["Ingredient Type Name"][0],
              superType: 'Liquor',
              type: liquorObj.fields["Type"][0],
              subType: liquorObj.fields["Subtype"][0]
            };

            let liquorModel: LiquorModel = {
              name: liquorObj.fields["Name"],
              brand: liquorObj.fields["Brand"],
              description: liquorObj.fields["Description"],
              ingredientNames: liquorObj.fields["Ingredient Names"],
              ingredientType: ingredientTypeModel
            };

            // debug
            // for(let key in spiritObj.fields) {
            //   console.log(key + '(' + spiritObj.fields[key] + ')'); //debug
            // }
            //end debug

            // console.log(liquorModel.ingredientType.name + ' Names(' + liquorModel.ingredientNames +')');  //debug

            return liquorModel;
          }
        );

        return allSpiritTypes;
      }));
  }

  private getRecipeMainComponentsObservable() {
    // this.recipeComponentService.GetPrimaries()
    return this.recipeComponentService.GetPrimariesFromAirtable()
      .pipe(
        map(response => {
          let allValues = response.records.map(
            obj => {
              return obj.fields.Name;
            }
          );

          return allValues;
        })
        );
  }

  private getRecipeAuxComponentsObservable() {
    // this.recipeComponentService.GetSecondaries()
    return this.recipeComponentService.GetSecondariesFromAirtable()
      .pipe(
        map(response => {
          let allValues = response.records.map(
            obj => {
              return obj.fields.Name;
            }
          );

          return allValues;
        })
        );
  }

private getRecipeTertComponentsObservable() {
  return this.recipeComponentService.GetTertiariesFromAirtable()
  .pipe(
    map(response => {
      let allValues = response.records.map(
        obj => {
          // console.log(obj.fields);  //debug
          return obj.fields.Name;
        }
      );

      // console.log("All Tertiary Components(" + allValues.join(", ") + ")");  //debug
      return allValues;
    })
  );
}

  private getRecipeFamiliesObservable() {
    // this.recipeCategoryService.GetFamilies()
    return this.recipeCategoryService.GetFamiliesFromAirtable()
      .pipe(
        map(response => {
          let allValues = response.records.map(
            obj => {
              return obj.fields.Name;
            }
          );

          return allValues;
        }));
  }

  private getRecipeStylesObservable() {
    // this.recipeCategoryService.GetStyles()
    return this.recipeCategoryService.GetStylesFromAirtable()
      .pipe(
        map(response => {
          let allValues = response.records.map(
            obj => {
              return obj.fields.Name;
            }
          );

          return allValues;
        }));
  }

  private getRecipeOccasionsObservable() {
    // this.recipeCategoryService.GetOccasions()
    return this.recipeCategoryService.GetOccasionsFromAirtable()
      .pipe(
        map(response => {
          let allValues = response.records.map(
            obj => {
              return obj.fields.Name;
            }
          );

          return allValues;
        }));
  }

  private getRecipeTypesObservable() {
    // this.recipeCategoryService.GetTypes()
    return this.recipeCategoryService.GetTypesFromAirtable()
      .pipe(
        map(response => {
          let allValues = response.records.map(
            obj => {
              return obj.fields.Name;
            }
          );

          return allValues;
        }));
  }

  public updateAvailableComponentsBasedOnInventory() {
    // console.log('updateAvailableComponentsBasedOnInventory()');  //debug

    // console.log("Inventory(" + this.selectedInventory + ")"); //debug
    // console.log("Limit(" + this.limitToAvailable + "), Inventory(" + this.selectedInventory + ")"); //debug

    // get available liquors
    if (this.selectedInventory !== null
      && this.selectedInventory !== undefined
      && this.selectedInventory.length > 0) {
      // Get available main components
      this.getAvailableSpiritsObservable()
        .subscribe((data: LiquorModel[]) => {
          // console.log("Total liquors(" + data.length + ")");  //debug

          for (let i = 0; i < data.length; i++) {
            let liquorModel: LiquorModel = data[i];

            // Remove blanks
            if (liquorModel === null || liquorModel === undefined) {
              continue;
            }

            // console.log("Liquor(" + liquorModel.ingredientType.name + ")"); //debug

            // // Prevent duplicates
            // if(liquorModel.ingredientType.name in this.allAvailableSpirits) {
            //   console.log("Ignoring duplicate " + liquorModel.brand + " " + liquorModel.description); //debug
            //   continue;
            // }

            if (this.allAvailableSpirits[liquorModel.ingredientType.name] === undefined) {
              this.allAvailableSpirits[liquorModel.ingredientType.name] = new Array();
            }

            this.allAvailableSpirits[liquorModel.ingredientType.name].push(liquorModel);
          }
        });

      // Get available secondary components
      this.getAvailableNonSpiritsObservable()
        .subscribe((data: LiquorModel[]) => {
          // console.log("Total liquors(" + data.length + ")");  //debug

          for (let i = 0; i < data.length; i++) {
            let liquorModel: LiquorModel = data[i];

            // Remove blanks
            if (liquorModel === null || liquorModel === undefined) {
              continue;
            }

            // console.log("Liquor(" + liquorModel.ingredientType.name + ")"); //debug

            // // Prevent duplicates
            // if(liquorModel.ingredientType.name in this.allAvailableNonSpirits) {
            //   console.log("Ignoring duplicate " + liquorModel.brand + " " + liquorModel.description); //debug
            //   continue;
            // }

            if (this.allAvailableNonSpirits[liquorModel.ingredientType.name] === undefined) {
              this.allAvailableNonSpirits[liquorModel.ingredientType.name] = new Array();
            }

            this.allAvailableNonSpirits[liquorModel.ingredientType.name].push(liquorModel);
          }
        });
    }

    // Enable all options
    if (this.limitToAvailable !== true
      || this.selectedInventory === null
      || this.selectedInventory === undefined
      || this.selectedInventory.length === 0
      || Object.keys(this.allAvailableSpirits).length === 0
      || Object.keys(this.allAvailableNonSpirits).length === 0) {
      this.enableAllRecipeComponentOptions();
      return;
    }

    // Enable all available spirits
    let groupName = this.primaryOptions.name;
    // console.log("Group(" + groupName + ")");  //debug

    for (let i = 0; i < this.primaryOptions.subOptions.length; i++) {
      let subOptionName = this.primaryOptions.subOptions[i].name
      let isAvailable: boolean = subOptionName in this.allAvailableSpirits;
      // console.log(subOptionName + ' available(' + isAvailable + ')');  //debug

      // if (isAvailable === true) { console.log(subOptionName + ' available(' + isAvailable + ')'); }  //debug

      // if (isAvailable != true) {
      //   this.primaryOptions.subOptions[i].selected = false;
      // }

      // this.primaryOptions.subOptions[i].enabled = isAvailable;
    }

    this.updateSelectedPrimaryComponents();

    // Enable all available non-spirits
    groupName = this.secondaryOptions.name;
    // console.log("Group(" + groupName + ")");  //debug

    for (let i = 0; i < this.secondaryOptions.subOptions.length; i++) {
      let subOptionName = this.secondaryOptions.subOptions[i].name
      let isAvailable: boolean = subOptionName in this.allAvailableNonSpirits;
      // console.log(subOptionName + ' available(' + isAvailable + ')');  //debug

      // if (isAvailable === true) { console.log(subOptionName + ' available(' + isAvailable + ')'); }  //debug

      // if (isAvailable != true) {
      //   this.secondaryOptions.subOptions[i].selected = false;
      // }

      // this.secondaryOptions.subOptions[i].enabled = isAvailable;
    }

    this.updateSelectedSecondaryComponents();
  }

  private enableAllRecipeComponentOptions() {
    this.primaryOptions.subOptions.forEach(o => {
      if (this.areAllPrimaryComponentsSelected === true) {
        o.selected = true;
      }

      o.enabled = true;
    });

    // this.setAllEnabledPrimaryComponentsSelected(this.areAllPrimaryComponentsSelected);
    this.updateSelectedPrimaryComponents();

    this.secondaryOptions.subOptions.forEach(o => {
      if (this.areAllSecondaryComponentsSelected === true) {
        o.selected = true;
      }

      o.enabled = true;
    });

    this.updateSelectedSecondaryComponents();

    this.tertiaryOptions.subOptions.forEach(o => {
      if (this.areAllTertiaryComponentsSelected === true) {
        o.selected = true;
      }

      o.enabled = true;
    });

    this.updateSelectedTertiaryComponents();
  }

  protected addSubOptions(group: string[], option: Option) {
    // console.log('addSubOptions(' + group + ', ' + option + ')');  //debug

    let isAvailable: boolean = true;

    // // If limiting disable primary and secondary components by default
    // if(this.limitToAvailable === true 
    //   && this.selectedInventory !== null 
    //   && this.selectedInventory !== undefined 
    //   && this.selectedInventory.length > 0
    //   && (option.name === this.primaryOptions.name || option.name === this.secondaryOptions.name)) {
    //   isAvailable = false;
    // }

    for (let i in group) {
      let value = group[i];
      // console.log("Group Option(" + value + "), Available(" + isAvailable + ")");  //debug

      option.subOptions.push({ name: value, selected: isAvailable, enabled: isAvailable });
    }
  }

  setGroupSelected(group: string, selected: boolean) {
    console.log('setGroupSelected(' + group + ', ' + selected + ')');  //debug

    console.log(group + ' group checkboxes have been set to ' + selected);  //debug

    switch (group) {
      case "Type":
        this.setAllTypesSelected(selected);
        break;

      case "Occasion":
        this.setAllOccasionsSelected(selected);
        break;

      case "Style":
        this.setAllStylesSelected(selected);
        break;

      case "Family":
        this.setAllFamiliesSelected(selected);
        break;

      case "Main":
        this.setAllEnabledPrimaryComponentsSelected(selected);
        break;

      case "Auxiliary":
        this.setAllEnabledSecondaryComponentsSelected(selected);
        break;

        case "Non-Alcoholic":
          this.setAllEnabledTertiaryComponentsSelected(selected);
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

  setAllOccasionsSelected(selected: boolean) {
    this.areAllOccasionsSelected = selected;

    if (this.occasionOptions.subOptions == null) {
      return;
    }

    this.occasionOptions.subOptions.forEach(o => o.selected = selected);

    this.updateSelectedOccasions();
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

  setAllEnabledPrimaryComponentsSelected(selected: boolean) {
    // console.log('setAllEnabledPrimaryComponentsSelected(' + selected + ')');  //debug

    this.areAllPrimaryComponentsSelected = selected;

    if (this.primaryOptions.subOptions == null) {
      return;
    }

    this.primaryOptions.subOptions.forEach(option => {
      // console.log(o.name + ' enabled(' + o.enabled + ')');  //debug
      if (option.enabled === true) {
        option.selected = selected;
        // console.log('Set ' + option.name + ' selection to ' + selected);  //debug 
      }
    });

    this.updateSelectedPrimaryComponents();
  }

  setAllEnabledSecondaryComponentsSelected(selected: boolean) {
    // console.log('setAllEnabledSecondaryComponentsSelected(' + selected + ')');  //debug

    this.areAllSecondaryComponentsSelected = selected;

    if (this.secondaryOptions.subOptions == null) {
      return;
    }

    this.secondaryOptions.subOptions.forEach(o => { if (o.enabled) { o.selected = selected; } });

    this.updateSelectedSecondaryComponents();
  }

  setAllEnabledTertiaryComponentsSelected(selected: boolean) {
    // console.log('setAllEnabledTertiaryComponentsSelected(' + selected + ')');  //debug

    this.areAllTertiaryComponentsSelected = selected;

    if (this.tertiaryOptions.subOptions == null) {
      return;
    }

    this.tertiaryOptions.subOptions.forEach(o => { if (o.enabled) { o.selected = selected; } });

    this.updateSelectedTertiaryComponents();
  }

  toggleSelected(group: string, name: string, selected: boolean) {
    // console.log('toggleSelected(' + group + ', ' + name + ', ' + selected + ')');  //debug

    // console.log(group + " " + name + ' checkbox has been set to ' + selected);  //debug

    switch (group) {
      case "Type":
        this.updateSelectedTypes();
        break;

      case "Occasion":
        this.updateSelectedOccasions();
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

        case "Non-Alcoholic":
          this.updateSelectedTertiaryComponents();
          break;
    }
  }

  updateSelectedTypes() {
    this.areAllTypesSelected = this.typeOptions.subOptions != null
      && this.typeOptions.subOptions.every(o => o.selected);

    if (this.areAllTypesSelected == true) {
      //console.log("All Types selected");  //debug
      this.allSelectedTypes = ["all"];
      return;
    }

    this.allSelectedTypes = [];
    for (let i in this.typeOptions.subOptions) {
      let type = this.typeOptions.subOptions[i];
      if (type.selected != true) {
        continue;
      }

      this.allSelectedTypes.push(type.name);
    }
  }

  updateSelectedOccasions() {
    this.areAllOccasionsSelected = this.occasionOptions.subOptions != null
      && this.occasionOptions.subOptions.every(o => o.selected);

    if (this.areAllOccasionsSelected == true) {
      this.allSelectedOccasions = ["all"];
      return;
    }

    this.allSelectedOccasions = [];
    for (let i in this.occasionOptions.subOptions) {
      let occasion = this.occasionOptions.subOptions[i];
      if (occasion.selected != true) {
        continue;
      }

      this.allSelectedOccasions.push(occasion.name);
    }
  }

  updateSelectedStyles() {
    this.areAllStylesSelected = this.styleOptions.subOptions != null
      && this.styleOptions.subOptions.every(o => o.selected);

    if (this.areAllStylesSelected == true) {
      this.allSelectedStyles = ["all"];
      return;
    }

    this.allSelectedStyles = [];
    for (let i in this.styleOptions.subOptions) {
      let style = this.styleOptions.subOptions[i];
      if (style.selected != true) {
        continue;
      }

      this.allSelectedStyles.push(style.name);
    }
  }

  updateSelectedFamilies() {
    this.areAllFamiliesSelected = this.familyOptions.subOptions != null
      && this.familyOptions.subOptions.every(o => o.selected);

    if (this.areAllFamiliesSelected == true) {
      this.allSelectedFamilies = ["all"];
      return;
    }

    this.allSelectedFamilies = [];
    for (let i in this.familyOptions.subOptions) {
      let family = this.familyOptions.subOptions[i];
      if (family.selected != true) {
        continue;
      }

      this.allSelectedFamilies.push(family.name);
    }
  }

  updateSelectedPrimaryComponents() {
    // console.log('updateSelectedPrimaryComponents()'); //debug

    let areAllAvailableSelected = true;
    let areAllAvailable = true;

    this.allSelectedPrimaryComponents = [];
    if (this.primaryOptions.subOptions !== null) {
      for (let i = 0; i < this.primaryOptions.subOptions.length; i++) {
        let primaryComponent = this.primaryOptions.subOptions[i];

        areAllAvailable = areAllAvailable && primaryComponent.enabled;
        if (primaryComponent.enabled !== true) {
          continue;
        }

        areAllAvailableSelected = areAllAvailableSelected && primaryComponent.selected;

        if (primaryComponent.selected !== true) {
          continue;
        }

        this.allSelectedPrimaryComponents.push(primaryComponent.name);
      }
    }

    this.areAllPrimaryComponentsSelected = areAllAvailableSelected;

    if (areAllAvailable !== true || areAllAvailableSelected !== true) {
      return;
    }

    this.allSelectedPrimaryComponents = ["all"];
  }

  updateSelectedSecondaryComponents() {
    // console.log('updateSelectedSecondaryComponents()'); //debug

    let areAllAvailableSelected = true;
    let areAllAvailable = true;

    this.allSelectedSecondaryComponents = [];
    if (this.secondaryOptions.subOptions !== null) {
      for (let i = 0; i < this.secondaryOptions.subOptions.length; i++) {
        let secondaryComponent = this.secondaryOptions.subOptions[i];

        areAllAvailable = areAllAvailable && secondaryComponent.enabled;
        if (secondaryComponent.enabled !== true) {
          continue;
        }

        areAllAvailableSelected = areAllAvailableSelected && secondaryComponent.selected;

        if (secondaryComponent.selected !== true) {
          continue;
        }

        this.allSelectedSecondaryComponents.push(secondaryComponent.name);
      }
    }

    this.areAllSecondaryComponentsSelected = areAllAvailableSelected;

    if (areAllAvailable !== true || areAllAvailableSelected !== true) {
      return;
    }

    this.allSelectedSecondaryComponents = ["all"];
  }

  updateSelectedTertiaryComponents() {
    // console.log('updateSelectedTertiaryComponents()'); //debug

    let areAllAvailableSelected = true;
    let areAllAvailable = true;

    this.allSelectedTertiaryComponents = [];
    if (this.tertiaryOptions.subOptions !== null) {
      for (let i = 0; i < this.tertiaryOptions.subOptions.length; i++) {
        let tertiaryComponent = this.tertiaryOptions.subOptions[i];

        areAllAvailable = areAllAvailable && tertiaryComponent.enabled;
        if (tertiaryComponent.enabled !== true) {
          continue;
        }

        areAllAvailableSelected = areAllAvailableSelected && tertiaryComponent.selected;

        if (tertiaryComponent.selected !== true) {
          continue;
        }

        this.allSelectedTertiaryComponents.push(tertiaryComponent.name);
      }
    }

    this.areAllTertiaryComponentsSelected = areAllAvailableSelected;

    if (areAllAvailable !== true || areAllAvailableSelected !== true) {
      return;
    }

    this.allSelectedTertiaryComponents = ["all"];
  }
}
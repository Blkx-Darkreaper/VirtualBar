import { IngredientTypeModel } from '../Models/ingredient-type-model';
import { LiquorModel } from './../Models/liquor-model';
import { InventoryService } from './../Services/inventory.service';
import { RecipeComponentsService } from '../Services/recipe-components.service';
import { RecipeCategoriesService } from '../Services/recipe-categories.service';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
//import {ThemePalette} from '@angular/material/core';
import { FormGroup, FormBuilder, FormArray, FormControl, NgModel } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';

export interface Option {
  name: string;
  selected: boolean;
  indeterminate?: boolean;
  enabled: boolean;
  //color: ThemePalette;
  subOptions?: Option[];
}

export interface DrilldownOption {
  id: number;
  enabled: boolean;
  selected: string;
  level: IngredientLevel;
  allValues: string[];
  parent?: DrilldownOption;
  child?: DrilldownOption;
}

export enum IngredientLevel {
  Supertype = 0,
  Type = 1,
  Subtype = 2,
  Category = 3,
  Subcategory = 4
}

@Component({
  selector: 'app-recipe-selection',
  templateUrl: './recipe-selection.component.html',
  styleUrls: ['./recipe-selection.component.sass']
})
export class RecipeSelectionComponent implements OnInit, OnChanges {
  readonly ALL: string = "all";

  allInventories: string[];

  // selectionForm: FormGroup;

  selectedParams: {
    allTypes: string[];
    allOccasions: string[];
    allStyles: string[];
    allFamilies: string[];
    allPrimaryComponents: string[];
    allSecondaryComponents: string[];
    allTertiaryComponents: string[];
    muddlingReq: boolean;
    search: string;
  } = {
    allTypes: [],
    allOccasions: [],
    allStyles: [],
    allFamilies: [],
    allPrimaryComponents: [],
    allSecondaryComponents: [],
    allTertiaryComponents: [],
    muddlingReq: false,
    search: ''
  }

  // allTypes: string[];
  typeOptions: Option = {
    name: 'Type',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedTypes: string[] = [this.ALL];

  allOccasions: string[];
  occasionOptions: Option = {
    name: 'Occasion',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedOccasions: string[] = [this.ALL];
  areAllOccasionsSelected: boolean = true;

  allStyles: string[];
  styleOptions: Option = {
    name: 'Style',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedStyles: string[] = [this.ALL];
  areAllStylesSelected: boolean = true;

  allFamilies: string[];
  familyOptions: Option = {
    name: 'Family',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedFamilies: string[] = [this.ALL];
  areAllFamiliesSelected: boolean = true;

  allPrimaryComponents: string[];
  primaryOptions: Option = {
    name: 'Main',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedPrimaryComponents: string[] = [this.ALL];
  areAllPrimaryComponentsSelected: boolean = true;

  allSecondaryComponents: string[];
  secondaryOptions: Option = {
    name: 'Auxiliary',
    selected: true,
    enabled: true,
    subOptions: []
  };
  allSelectedSecondaryComponents: string[] = [this.ALL];
  areAllSecondaryComponentsSelected: boolean = true;

  allTertiaryComponents: string[];

  allSpecificIngredients: DrilldownOption[] = [];

  muddlingRequired: boolean = false;

  nameToFind: string = '';

  // selectedUserId: number = -1;
  selectedUserId: number = 1; // testing
  selectedInventory: string = '';
  limitToAvailable: boolean = false;

  allAvailableLiquors = {};
  allAvailableSpirits: { [type: string]: LiquorModel[]; } = {};
  allAvailableNonSpirits: { [type: string]: LiquorModel[]; } = {};

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private recipeCategoryService: RecipeCategoriesService,
    private recipeComponentService: RecipeComponentsService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    console.log("Recipe-Selection ngOnInit()"); //debug

    this.activatedRoute.queryParams.subscribe(queryParams => {
      if(queryParams.drinkType) {
        console.log("Query Types(" + queryParams.drinkType + ")");  //debug
        this.selectedParams.allTypes = queryParams.drinkType;
      }

      if(queryParams.search) {
        console.log("Search(" + queryParams.search + ")");  //debug
        this.selectedParams.search = queryParams.search;
      }
    });

    // console.log("Inventory(" + this.selectedInventory + ")"); //debug

    this.addOptions();

    //this.selectionForm = this.formBuilder.group({});

    // this.updateAvailableComponentsBasedOnInventory();
  }

  changeQuery() {
    console.log("Recipe-Selection changeQuery()"); //debug

    // this.updateSelectedFromQueryParams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Recipe-Selection ngOnChanges(" + changes + ")");  //debug
    // console.log("Inventory(" + this.selectedInventory + ")"); //debug

    // this.updateSelectedQueryParams();

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

  updateSelectedQueryParams() {
    const queryParams: Params = { };

    console.log("Selected Types(" + this.allSelectedTypes.join(', ') + ")");  //debug
    if(this.allSelectedTypes.length > 0 && this.allSelectedTypes[0] !== this.ALL) {
      queryParams.drinkType = this.allSelectedTypes;
    } else {
      queryParams.drinkType = null;
    }

    if(this.nameToFind.length > 0) {
      queryParams.search = this.nameToFind;
    } else {
      queryParams.search = null;
    }

    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  private updateSelectedFromQueryParams() {
    this.updateSelectedTypesFromQueryParams();

    this.updateRecipeSearchNameFromQueryParams();
  }

  updateSelectedTypesFromQueryParams() {
    if(!this.selectedParams.allTypes) {
      return;
    }
    if(this.selectedParams.allTypes.length == 0) {
      return;
    }
    if(this.selectedParams.allTypes[0] == this.ALL) {
        return;
    }

    for(let subOption of this.typeOptions.subOptions) {
      subOption.selected = this.selectedParams.allTypes.includes(subOption.name);
      console.log(subOption.name + " Selected(" + subOption.selected + ")");  //debug
    }
  }

  updateRecipeSearchNameFromQueryParams() {
    if(!this.selectedParams.search){
      return;
    } 
    if(this.selectedParams.search.length == 0) {
      return;
    }

    this.nameToFind = this.selectedParams.search;
  }

  private addOptions() {
    // console.log('addOptions()');  //debug

    // this.allTypes = [];
    this.getRecipeTypesObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        // this.allTypes = filteredList;
        this.addSubOptions(filteredList, this.typeOptions);
        console.log("1 Cocktail " + this.typeOptions.subOptions[0].selected); //debug

        this.toggleSelectedFromQueryParams(this.typeOptions, this.selectedParams.allTypes);
        console.log("2 Cocktail " + this.typeOptions.subOptions[0].selected); //debug

        this.allSelectedTypes = this.toggleSelected(this.typeOptions, "");
        console.log("3 Cocktail " + this.typeOptions.subOptions[0].selected); //debug
      });

    this.allOccasions = [];
    this.getRecipeOccasionsObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allOccasions = filteredList;
        this.addSubOptions(filteredList, this.occasionOptions);
        this.toggleSelected(this.occasionOptions, "");
      });

    this.allStyles = [];
    this.getRecipeStylesObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allStyles = filteredList;
        this.addSubOptions(filteredList, this.styleOptions);
        this.toggleSelected(this.styleOptions, "");
      });

    this.allFamilies = [];
    this.getRecipeFamiliesObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allFamilies = filteredList;
        this.addSubOptions(filteredList, this.familyOptions);
        this.toggleSelected(this.familyOptions, "");
      });

    this.allPrimaryComponents = [];
    this.getRecipeMainComponentsObservable()
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks

        let sortedList = filteredList.sort((a, b) => a.localeCompare(b));

        filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

        this.allPrimaryComponents = filteredList;
        this.addSubOptions(filteredList, this.primaryOptions);
        this.toggleSelected(this.primaryOptions, "");
      });

    this.allSecondaryComponents = [];
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
        this.toggleSelected(this.secondaryOptions, "");
      });

    this.allTertiaryComponents = [];
      /* this.getRecipeTertComponentsObservable()
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
        // this.addSubOptions(filteredList, this.tertiaryOptions);
        // this.toggleSelected(this.tertiaryOptions, "");
      }); */

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
        let allUserIds = response.records.map(
          userObj => {
            return userObj.fields["ID"];
          }
        );

        return allUserIds;
      }));
    /* return this.inventoryService.GetInventoriesFromAirtable()
      .pipe(map(response => {
        let allInventories = response.records.map(
          inventoryObj => {
            return inventoryObj.fields["Address"];
          }
        );

        return allInventories;
      })); */
  }

  private getAvailableLiquorsObservable() {
    return this.inventoryService.GetLiquorIngredientNamesFromAirtable(this.selectedUserId)
      .pipe(map(response => {
        let allLiquors = [];
        
        response.records.map(
          liquorObj => {
            liquorObj.fields["Ingredient Names"].forEach((ingredient: string) => allLiquors.push(ingredient));
          }
        );

        return allLiquors;
      }))
  }

  private getAvailableNonSpiritsObservable() {
    // return this.inventoryService.GetNonSpiritLiquorTypesFromAirtable(this.selectedInventory)
    return this.inventoryService.GetNonSpiritLiquorTypesFromAirtable(this.selectedUserId)
      .pipe(map(response => {
        let allSpiritTypes = response.records.map(
          liquorObj => {
            // console.log(liquorObj.fields);  //debug

            let ingredientTypeModel: IngredientTypeModel = {
              name: liquorObj.fields["Ingredient Type Name"][0],
              superType: 'Liquor',
              type: liquorObj.fields["Type"][0]
            };

            if(liquorObj.fields["Subtype"] !== null
            && liquorObj.fields["Subtype"] !== undefined
            && liquorObj.fields["Subtype"].length > 0) {
              ingredientTypeModel.subType = liquorObj.fields["Subtype"][0];
            }

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
    // return this.inventoryService.GetSpiritLiquorTypesFromAirtable(this.selectedInventory)
    return this.inventoryService.GetSpiritLiquorTypesFromAirtable(this.selectedUserId)
      .pipe(map(response => {
        let allSpiritTypes = response.records.map(
          liquorObj => {
            let ingredientTypeModel: IngredientTypeModel = {
              name: liquorObj.fields["Ingredient Type Name"][0],
              superType: 'Liquor',
              type: liquorObj.fields["Type"][0]
            };

            if(liquorObj.fields["Subtype"] !== null
            && liquorObj.fields["Subtype"] !== undefined
            && liquorObj.fields["Subtype"].length > 0) {
              ingredientTypeModel.subType = liquorObj.fields["Subtype"][0];
            }

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

/* private getRecipeTertComponentsObservable() {
  return this.recipeComponentService.GetIngredientTypesFromAirtable()
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
} */
private getDrilldownValuesObservable(ingredientLevel: IngredientLevel) {
  let fieldName = ingredientLevel.toString();

  return this.recipeComponentService.GetIngredientTypesFromAirtable(fieldName)
  .pipe(
    map(response => {
      let allValues = response.records.map(
        obj => {
          return obj.fields.fieldName;
        }
      );

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
    // console.log("Limit(" + this.limitToAvailable + "), Inventory(" + this.selectedInventory + "), User("
    //  + this.selectedUserId + ")"); //debug

    // get available liquors
/*     if (this.selectedInventory !== null
      && this.selectedInventory !== undefined
      && this.selectedInventory.length > 0) { */
      if (this.selectedUserId > 0) {
      this.getAvailableLiquorsObservable()
        .subscribe((data: string[]) => {
          // console.log("Total liquors(" + data.length + ")");  //debug
          // data.forEach((e, i) => console.log(i + ": " + e));

          let filteredList = data.filter(
            n => n !== null && n !== undefined
          ); // Remove blanks

          let sortedList = filteredList.sort();  // Sort

          filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

          // console.log("Total Filtered liquors(" + filteredList.length + ")");  //debug
          // filteredList.forEach((e, i) => console.log(i + ": " + e));

          filteredList.forEach(ingredient => this.allAvailableLiquors[ingredient] = ingredient);
        });

      // Get available main components
      this.getAvailableSpiritsObservable()
        .subscribe((data: LiquorModel[]) => {
          // console.log("Total Spirits(" + data.length + ")");  //debug

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
          // console.log("Total Non-Spirits(" + data.length + ")");  //debug

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
      // this.enableAllRecipeComponentOptions();
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

      // if (isAvailable !== true) {
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

      // if (isAvailable !== true) {
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
/* 
    this.tertiaryOptions.subOptions.forEach(o => {
      if (this.areAllTertiaryComponentsSelected === true) {
        o.selected = true;
      }

      o.enabled = true;
    });

    this.updateSelectedTertiaryComponents(); */
  }

  protected addSubOptions(group: string[], option: Option) {
    // console.log('addSubOptions(' + group + ', ' + option + ')');  //debug

    for (let i in group) {
      let isAvailable: boolean = true;

      // // If limiting disable primary and secondary components by default
    // if(this.limitToAvailable === true 
    //   && this.selectedInventory !== null 
    //   && this.selectedInventory !== undefined 
    //   && this.selectedInventory.length > 0
    //   && (option.name === this.primaryOptions.name || option.name === this.secondaryOptions.name)) {
    //   isAvailable = false;
    // }

      let value = group[i];
      // console.log("Group Option(" + value + "), Available(" + isAvailable + ")");  //debug

      option.subOptions.push({ name: value, selected: isAvailable, enabled: isAvailable });
    }
  }

  setGroupSelected(group: Option, selected: boolean): string[] {
    console.log('setGroupSelected(' + group.name + ', ' + selected + ')');  //debug

    if (group.subOptions == null) {
      return;
    }
    
    group.selected = selected;
    group.subOptions.forEach((o) => o.selected = selected);
    // console.log(group + ' group checkboxes have been set to ' + selected);  //debug

    let allSelected = this.toggleSelected(group, group.name);

    switch (group.name) {
      // case "Type":
      //   this.updateSelectedTypes();
      //   break;

      // case "Occasion":
      //   this.updateSelectedOccasions();
      //   break;

      // case "Style":
      //   this.updateSelectedStyles();
      //   break;

      // case "Family":
      //   this.updateSelectedFamilies();
      //   break;

      case "Main":
        this.updateSelectedPrimaryComponents();
        break;

      case "Auxiliary":
        this.updateSelectedSecondaryComponents();
        break;

/*         case "Non-Alcoholic":
          this.updateSelectedTertiaryComponents();
          break; */
    }

    // this.updateSelectedQueryParams();

    return allSelected;
  }

  toggleSelectedFromQueryParams(group: Option, selectedOptions: string[]) {
    if(!selectedOptions) {
      return;
    }
    if(selectedOptions.length == 0) {
      return;
    }
    if(selectedOptions[0] == this.ALL) {
        return;
    }

    for(let subOption of group.subOptions) {
      subOption.selected = selectedOptions.indexOf(subOption.name) !== -1;
      console.log(subOption.name + " Selected(" + subOption.selected + ")");  //debug
    }
  }

  toggleSelected(group: Option, fieldName: string): string[] {
    // console.log('toggleSelected(' + group.name + ', ' + fieldName + ')');  //debug
      
    // console.log(group + " " + name + ' checkbox has been set to ' + selected);  //debug

    let allSelected = [];

    if(group.subOptions == null) {
      return allSelected;
    }

    // Adjust selection based on query params
    // console.log("Params(" + this.selectedParams.allTypes.join(",") + ")");  //debug

    if (group.subOptions.find(o=>!o.selected) == null) {
      group.selected = true;
    } 
    if (group.subOptions.find(o=>o.selected) == null){
      group.selected = false;
    }

    group.indeterminate = group.subOptions.find(o=>o.selected) !== null 
    && group.subOptions.find(o=>!o.selected) !== null;

    // console.log("All " + group.name + "s Selected("
    // + (group.selected && !group.indeterminate) + ")"); //debug

    if (group.selected == true && group.indeterminate !== true) {
      //console.log("All " + group.name + "s selected");  //debug
      allSelected = [this.ALL];
      return allSelected;
    }

    for (let subOption of this.typeOptions.subOptions) {
      if (subOption.selected !== true) {
        continue;
      }

      allSelected.push(subOption.name);
    }
  
    switch (group.name) {
      // case "Type":
      //   this.updateSelectedTypes();
      //   break;

      // case "Occasion":
      //   this.updateSelectedOccasions();
      //   break;

      // case "Style":
      //   this.updateSelectedStyles();
      //   break;

      // case "Family":
      //   this.updateSelectedFamilies();
      //   break;

      case "Main":
        this.updateSelectedPrimaryComponents();
        break;

      case "Auxiliary":
        this.updateSelectedSecondaryComponents();
        break;

        //  case "Non-Alcoholic":
        //   this.updateSelectedTertiaryComponents();
        //   break; 
    }

    return allSelected;
  }

  // updateSelectedTypes() {
  //   if(this.typeOptions.subOptions == null) {
  //     return;
  //   }

  //   // Adjust selection based on query params
  //   // console.log("Params(" + this.selectedParams.allTypes.join(",") + ")");  //debug

  //   if (this.typeOptions.subOptions.find(o=>!o.selected) == null) {
  //     this.typeOptions.selected = true;
  //   } 
  //   if (this.typeOptions.subOptions.find(o=>o.selected) == null){
  //     this.typeOptions.selected = false;
  //   }

  //   this.typeOptions.indeterminate = this.typeOptions.subOptions.find(o=>o.selected) !== null 
  //   && this.typeOptions.subOptions.find(o=>!o.selected) !== null;

  //   console.log("All Types Selected("
  //   + (this.typeOptions.selected && !this.typeOptions.indeterminate) + ")"); //debug

  //   if (this.typeOptions.selected == true && this.typeOptions.indeterminate !== true) {
  //     //console.log("All Types selected");  //debug
  //     this.allSelectedTypes = [this.ALL];
  //     return;
  //   }

  //   this.allSelectedTypes = [];
  //   for (let type of this.typeOptions.subOptions) {
  //     if (type.selected !== true) {
  //       continue;
  //     }

  //     this.allSelectedTypes.push(type.name);
  //   }
  // }

  // updateSelectedOccasions() {

  //   if (this.areAllOccasionsSelected == true) {
  //     this.allSelectedOccasions = [this.ALL];
  //     return;
  //   }

  //   this.allSelectedOccasions = [];
  //   for (let i in this.occasionOptions.subOptions) {
  //     let occasion = this.occasionOptions.subOptions[i];
  //     if (occasion.selected !== true) {
  //       continue;
  //     }

  //     this.allSelectedOccasions.push(occasion.name);
  //   }
  // }

  // updateSelectedStyles() {

  //   if (this.areAllStylesSelected == true) {
  //     this.allSelectedStyles = [this.ALL];
  //     return;
  //   }

  //   this.allSelectedStyles = [];
  //   for (let i in this.styleOptions.subOptions) {
  //     let style = this.styleOptions.subOptions[i];
  //     if (style.selected !== true) {
  //       continue;
  //     }

  //     this.allSelectedStyles.push(style.name);
  //   }
  // }

  // updateSelectedFamilies() {

  //   if (this.areAllFamiliesSelected == true) {
  //     this.allSelectedFamilies = [this.ALL];
  //     return;
  //   }

  //   this.allSelectedFamilies = [];
  //   for (let i in this.familyOptions.subOptions) {
  //     let family = this.familyOptions.subOptions[i];
  //     if (family.selected !== true) {
  //       continue;
  //     }

  //     this.allSelectedFamilies.push(family.name);
  //   }
  // }
  
  toggleComponentSelected(group: Option, fieldName: string): string[] {
    // console.log('toggleComponentSelected(' + group.name + ', ' + fieldName + ')');  //debug
      
    // console.log(group + " " + name + ' checkbox has been set to ' + selected);  //debug

    let allSelected = [];

    if(group.subOptions == null) {
      return allSelected;
    }

    // Adjust selection based on query params
    // console.log("Params(" + this.selectedParams.allTypes.join(",") + ")");  //debug

    if (group.subOptions.find(o=>!o.selected) == null) {
      group.selected = true;
    } 
    if (group.subOptions.find(o=>o.selected) == null){
      group.selected = false;
    }

    group.indeterminate = group.subOptions.find(o=>o.selected) !== null 
    && group.subOptions.find(o=>!o.selected) !== null;

    // console.log("All " + group.name + "s Selected("
    // + (group.selected && !group.indeterminate) + ")"); //debug

    if (group.selected == true && group.indeterminate !== true) {
      //console.log("All " + group.name + "s selected");  //debug
      allSelected = [this.ALL];
      return allSelected;
    }
    
    let areAllAvailableSelected = true;
    let areAllAvailable = true;

    for (let subOption of group.subOptions) {
      areAllAvailable = areAllAvailable && subOption.enabled;

      if (subOption.enabled !== true) {
        continue;
      }

      areAllAvailableSelected = areAllAvailableSelected && subOption.selected;

      if (subOption.selected !== true) {
        continue;
      }

      allSelected.push(subOption.name);
    }

    group.selected = areAllAvailableSelected;

    group.indeterminate = group.subOptions.find(o=>o.selected && o.enabled) !== null 
    && group.subOptions.find(o=>!o.selected && o.enabled) !== null;

    if (areAllAvailable === true && areAllAvailableSelected === true) {
      allSelected = [this.ALL];
      return allSelected;
    }
  
    // this.updateSelectedQueryParams();
    // this.updateSearch();

    return allSelected;
  }

  updateSelectedPrimaryComponents() {
    // console.log('updateSelectedPrimaryComponents()'); //debug

    let areAllAvailableSelected = true;
    let areAllAvailable = true;

    if (this.areAllPrimaryComponentsSelected == true) {
      //console.log("All Spirits selected");  //debug
      this.allSelectedPrimaryComponents = [this.ALL];
      return;
    }

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

    this.allSelectedPrimaryComponents = [this.ALL];
  }

  updateSelectedSecondaryComponents() {
    // console.log('updateSelectedSecondaryComponents()'); //debug

    let areAllAvailableSelected = true;
    let areAllAvailable = true;

    if (this.areAllSecondaryComponentsSelected == true) {
      //console.log("All Secondary components selected");  //debug
      this.allSelectedSecondaryComponents = [this.ALL];
      return;
    }

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

    this.allSelectedSecondaryComponents = [this.ALL];
  }

  addSpecificComponentFilter() {
    let nextIndex = this.allSpecificIngredients.length;

    this.allSpecificIngredients.push({id: nextIndex, enabled: true, selected:'', allValues:[],
    level: IngredientLevel.Supertype, parent: null});
  }

  removeSpecificComponentFilter(index: number) {
    this.allSpecificIngredients.splice(index, 1);
  }

  getAllSpecificComponentLevels(supertype: DrilldownOption): DrilldownOption[] {
    let allLevels = [ supertype ];

    let nextLevel = supertype.child;
    while(nextLevel !== null) {
      allLevels.push(nextLevel);

      nextLevel = nextLevel.child;
    }

    return allLevels;
  }

  /* updateSelectedTertiaryComponents() {
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

    this.allSelectedTertiaryComponents = [this.ALL];
  } */
}

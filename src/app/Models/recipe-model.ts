import { RecipeIngredientModel } from './recipe-ingredient-model';
export interface RecipeModel {
    id: number;
    name: string;
    variant: string;
    version?: number;
    type: string;
    allIngredients?: RecipeIngredientModel[];
    allDirections?: string[];
    missingIngredients?: boolean;
    allLiquorIngredientNames: string[];
  }
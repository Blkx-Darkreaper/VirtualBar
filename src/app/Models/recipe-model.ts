import { IngredientModel } from './ingredient-model';
export interface RecipeModel {
    id: number;
    name: string;
    variant: string;
    version?: number;
    type: string;
    allIngredients?: IngredientModel[];
    allDirections?: string[];
    missingIngredients?: boolean;
  }
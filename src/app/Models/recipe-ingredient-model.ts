import { IngredientModel } from './ingredient-model';
import { IngredientTypeModel } from './ingredient-type-model';
export interface RecipeIngredientModel extends IngredientModel {
  id: number;
  qualifier?: string;
  recipeId?: number;
  version?: number;
  order: number;
  optional: boolean;
  amountReq: {
    ounces?: IngredientAmountModel;
    millilitres?: IngredientAmountModel;
    quantity?: IngredientAmountModel;
    grams?: IngredientAmountModel;
    dashes?: IngredientAmountModel;
    barspoons?: IngredientAmountModel;
    cups?: IngredientAmountModel;
  }
  amountAvailable?: {
    ounces: number;
    millilitres: number;
  }
  notes?: string;
}

export interface IngredientAmountModel {
  units: string;
  amount: string;
}
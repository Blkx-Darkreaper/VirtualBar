import { IngredientTypeModel } from './Ingredient-type-model';
export interface IngredientModel {
  id: number;
  name: string;
  qualifier?: string;
  recipeId?: number;
  version?: number;
  order: number;
  optional: boolean;
  type: IngredientTypeModel;
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
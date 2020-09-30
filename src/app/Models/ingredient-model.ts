import { IngredientTypeModel } from './Ingredient-type-model';
export interface IngredientModel {
  order: number;
  name: string;
  qualifier?: string;
  recipeId?: number;
  optional: boolean;
  type?: IngredientTypeModel;
  amountReq: {
    ounces?: IngredientAmountModel;
    millilitres?: IngredientAmountModel;
    quantity?: IngredientAmountModel;
    grams?: IngredientAmountModel;
    dashes?: IngredientAmountModel;
    barspoons?: IngredientAmountModel;
    teaspoons?: IngredientAmountModel;
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
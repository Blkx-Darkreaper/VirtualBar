export interface IngredientModel {
  order: number;
  name: string;
  qualifier?: string;
  optional: boolean;
  amounts: {
    cups?: IngredientAmountModel;
    ounces?: IngredientAmountModel;
    millilitres?: IngredientAmountModel;
    quantity?: IngredientAmountModel;
    grams?: IngredientAmountModel;
    dashes?: IngredientAmountModel;
    barspoons?: IngredientAmountModel;
    teaspoons?: IngredientAmountModel;
    misc?: IngredientAmountModel;
  }
  notes?: string;
}

export interface IngredientAmountModel {
  units: string;
  amount: string;
}
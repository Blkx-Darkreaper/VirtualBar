export interface IngredientModel {
  order: number;
  name: string;
  qualifier?: string;
  amounts: {
    cups?: IngredientAmountModel;
    ounces?: IngredientAmountModel;
    millilitres?: IngredientAmountModel;
    quantity?: IngredientAmountModel;
    grams?: IngredientAmountModel;
    dashes?: IngredientAmountModel;
    barspoons?: IngredientAmountModel;
    teaspoons?: IngredientAmountModel;
  }
}

export interface IngredientAmountModel {
  units: string;
  amount: number;
}
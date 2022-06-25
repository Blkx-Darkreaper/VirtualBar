import { IngredientTypeModel } from './ingredient-type-model';
export interface IngredientModel {
  name: string;
  type: IngredientTypeModel;
}
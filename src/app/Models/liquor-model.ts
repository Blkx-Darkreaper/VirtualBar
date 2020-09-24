import { IngredientTypeModel } from './Ingredient-type-model';
export interface LiquorModel {
    id?: number;
    brand: string;
    description: string;
    ingredientType: IngredientTypeModel;
    //allTypes: IngredientTypeModel[];
    ounces?: number;
    millilitres?: number;
}
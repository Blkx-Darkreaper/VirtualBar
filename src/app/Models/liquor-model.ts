import { IngredientTypeModel } from './Ingredient-type-model';
export interface LiquorModel {
    id?: number;
    name: string;
    brand: string;
    description: string;
    ingredientNames: string[];
    ingredientType: IngredientTypeModel;
    //allTypes: IngredientTypeModel[];
    ounces?: number;
    millilitres?: number;
}
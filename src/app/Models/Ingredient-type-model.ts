export interface IngredientTypeModel {
  name: string;
  superType: string;
  type?: string;
  subType?: string;
  qualifier?: string;
  aged?: string[];
  notes?: string;
}
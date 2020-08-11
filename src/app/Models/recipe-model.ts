export interface RecipeModel {
    id: number;
    name: string;
    variant: string;
    version: number;
    type: string;
    allIngredients?: string[];
    allDirections?: string[];
  }
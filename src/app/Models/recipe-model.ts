export interface RecipeModel {
    id: number;
    name: string;
    variant: string;
    version: number;
    allIngredients?: string[];
    allDirections?: string[];
  }
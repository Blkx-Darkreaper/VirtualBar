export interface RecipeModel {
    id: string;
    fields: {
      name: string;
      variant: string;
    }
    createdTime: Date;
    allIngredients?: string[];
    allDirections?: string[];
  }
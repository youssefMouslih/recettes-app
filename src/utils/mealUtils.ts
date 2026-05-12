import { MealDetail } from '../context/MealContext';

export type IngredientItem = {
  label: string;
  value: string;
  imageUrl: string;
};

const buildIngredientImageUrl = (ingredient: string): string => {
  const normalized = ingredient.trim().toLowerCase().replace(/\s+/g, '_');
  return `https://www.themealdb.com/images/ingredients/${normalized}-large.png`;
};

export const parseIngredients = (meal: MealDetail): IngredientItem[] => {
  const ingredients: IngredientItem[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`] as string | null;
    const measure = meal[`strMeasure${index}`] as string | null;

    if (ingredient && ingredient.trim().length > 0) {
      const label = ingredient.trim();
      ingredients.push({
        label,
        value: measure?.trim() ?? '',
        imageUrl: buildIngredientImageUrl(label),
      });
    }
  }

  return ingredients;
};

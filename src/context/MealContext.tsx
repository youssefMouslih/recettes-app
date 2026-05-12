import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCategories,
  fetchMealDetailById,
  fetchMealsByCategory,
  searchMealsByName,
} from '../services/mealsService';

export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type MealDetail = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  [key: string]: string | null;
};

type MealContextData = {
  categories: Category[];
  meals: MealSummary[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  selectCategory: (category: string) => Promise<void>;
  searchMeals: (query: string) => Promise<void>;
  refreshMeals: () => Promise<void>;
  getMealDetail: (id: string) => Promise<MealDetail | null>;
};

const MealContext = createContext<MealContextData | undefined>(undefined);

export const MealProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Beef');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      if (!selectedCategory && data.length > 0) {
        setSelectedCategory(data[0].strCategory);
      }
      return data;
    } catch (err) {
      setError('Impossible de charger les catégories.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadMeals = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMealsByCategory(category);
      setMeals(data);
    } catch (err) {
      setError('Impossible de charger les repas.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      if (query.trim().length === 0) {
        await loadMeals(selectedCategory);
        return;
      }
      const data = await searchMealsByName(query.trim());
      setMeals(data);
    } catch (err) {
      setError('Recherche de repas échouée.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = async (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    await loadMeals(category);
  };

  const searchMeals = async (query: string) => {
    setSearchQuery(query);
    await loadSearch(query);
  };

  const refreshMeals = async () => {
    if (searchQuery.trim().length > 0) {
      await loadSearch(searchQuery);
    } else {
      await loadMeals(selectedCategory);
    }
  };

  const getMealDetail = async (id: string) => {
    return fetchMealDetailById(id);
  };

  useEffect(() => {
    const initialize = async () => {
      const categoriesData = await loadCategories();
      if (categoriesData.length > 0 && !selectedCategory) {
        await loadMeals(categoriesData[0].strCategory);
      } else if (categoriesData.length > 0) {
        await loadMeals(selectedCategory);
      }
    };
    initialize();
  }, []);

  const value = useMemo(
    () => ({
      categories,
      meals,
      selectedCategory,
      searchQuery,
      loading,
      error,
      selectCategory,
      searchMeals,
      refreshMeals,
      getMealDetail,
    }),
    [categories, meals, selectedCategory, searchQuery, loading, error],
  );

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
};

export const useMealContext = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMealContext must be used within MealProvider');
  }
  return context;
};

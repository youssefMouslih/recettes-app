import axios from 'axios';
import { Category, MealDetail, MealSummary } from '../context/MealContext';

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
  timeout: 10000,
});

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories.php');
  return response.data.categories ?? [];
};

export const fetchMealsByCategory = async (category: string): Promise<MealSummary[]> => {
  const response = await api.get('/filter.php', { params: { c: category } });
  return response.data.meals ?? [];
};

export const searchMealsByName = async (query: string): Promise<MealSummary[]> => {
  if (!query.trim()) {
    return [];
  }
  const response = await api.get('/search.php', { params: { s: query } });
  return response.data.meals ?? [];
};

export const fetchMealDetailById = async (id: string): Promise<MealDetail | null> => {
  const response = await api.get('/lookup.php', { params: { i: id } });
  return response.data.meals?.[0] ?? null;
};
